"use server";

import { isRedirectError } from "next/dist/client/components/redirect-error";
import { convertToPlainObject, formatError } from "../utils";
import { auth } from "@/auth";
import { getMyCart } from "./cart.actions";
import { getUserById } from "./user.actions";
import { PAGE_SIZE, paths } from "../constants";
import { InsertOrderSchema } from "../validators";
import { prisma } from "@/db/prisma";
import { CartItem, PaymentResult } from "@/types";
import { paypal } from "../paypal";
import { revalidatePath } from "next/cache";
import { Prisma } from "@/generated/prisma";

export const createOrder = async () => {
  try {
    const session = await auth();
    if (!session) throw new Error("User is not authenticated");

    const cart = await getMyCart();

    const userId = session.user?.id;
    if (!userId) throw new Error("User not found");

    const user = await getUserById(userId);

    if (!cart || cart.items.length === 0) {
      return {
        success: false,
        message: "Your cart is empty",
        redirectTo: paths.cart(),
      };
    }
    if (!user.address) {
      return {
        success: false,
        message: "No shipping address",
        redirectTo: paths.shipping(),
      };
    }
    if (!user.paymentMethod) {
      return {
        success: false,
        message: "Payment method required",
        redirectTo: paths.paymentMethod(),
      };
    }

    //create order object
    const order = InsertOrderSchema.parse({
      userId: user.id,
      shippingAddress: user.address,
      paymentMethod: user.paymentMethod,
      itemsPrice: cart.itemsPrice,
      shippingPrice: cart.shippingPrice,
      taxPrice: cart.taxPrice,
      totalPrice: cart.totalPrice,
    });

    //create a transaction to create order and order items in DB
    const insertedOrderId = await prisma.$transaction(async (tx) => {
      //create order
      const insertedOrder = await tx.order.create({ data: order });
      //create order items from the cart items
      for (const item of cart.items as CartItem[]) {
        await tx.orderItem.create({
          data: {
            ...item,
            price: item.price,
            orderId: insertedOrder.id,
          },
        });
      }

      //clear the cart
      await tx.cart.update({
        where: { id: cart.id },
        data: {
          items: [],
          totalPrice: 0,
          taxPrice: 0,
          shippingPrice: 0,
          itemsPrice: 0,
        },
      });

      return insertedOrder.id;
    });

    if (!insertedOrderId) throw new Error("Order not created");

    return {
      success: true,
      message: "Order created",
      redirectTo: paths.order(insertedOrderId),
    };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    return {
      success: false,
      message: formatError(error),
    };
  }
};

export const getOrderById = async (orderId: string) => {
  const data = await prisma.order.findFirst({
    where: {
      id: orderId,
    },
    include: {
      orderitems: true,
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  return convertToPlainObject(data);
};

export const createPayPalOrder = async (orderId: string) => {
  try {
    //get order from DB
    const order = await prisma.order.findFirst({
      where: { id: orderId },
    });

    if (order) {
      //create new paypal order
      const paypalOrder = await paypal.createOrder(Number(order.totalPrice));

      //update order with paypal order id
      await prisma.order.update({
        where: { id: orderId },
        data: {
          paymentResult: {
            id: paypalOrder.id,
            email_address: "",
            status: "",
            pricePaid: 0,
          },
        },
      });

      return {
        success: true,
        message: "Item order created successfully",
        data: paypalOrder.id,
      };
    } else {
      throw new Error("Order not found");
    }
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
};

//approve paypal order and update order to paid
export const approvePayPalOrder = async (
  orderId: string,
  data: { orderId: string }
) => {
  try {
    //get order from DB
    const order = await prisma.order.findFirst({
      where: { id: orderId },
    });

    if (!order) throw new Error("Order not found");

    const captureData = await paypal.capturePayment(data.orderId);

    if (
      !captureData ||
      captureData.id !== (order.paymentResult as PaymentResult)?.id ||
      captureData.status !== "COMPLETED"
    ) {
      throw new Error("Error in PayPal payment");
    }

    //update order to paid
    await updateOrderToPaid({
      orderId,
      paymentResult: {
        id: captureData.id,
        status: captureData.status,
        email_address: captureData.payer.email_address,
        pricePaid:
          captureData.purchase_units[0]?.payments?.captures[0]?.amount?.value,
      },
    });

    revalidatePath(paths.order(orderId));

    return {
      success: true,
      message: "Your order has been paid",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
};

//update order to paid
const updateOrderToPaid = async ({
  orderId,
  paymentResult,
}: {
  orderId: string;
  paymentResult?: PaymentResult;
}) => {
  //get order from DB
  const order = await prisma.order.findFirst({
    where: { id: orderId },
    include: {
      orderitems: true,
    },
  });

  if (!order) throw new Error("Order not found");

  if (order.isPaid) throw new Error("Order has been paid already");

  //transaction to update order and account for product stock
  await prisma.$transaction(async (tx) => {
    //iterate over products and update the stock
    for (const item of order.orderitems) {
      await tx.product.update({
        where: {
          id: item.productId,
        },
        data: {
          stock: { increment: -item.qty },
        },
      });
    }

    //set the order to paid
    await tx.order.update({
      where: {
        id: orderId,
      },
      data: {
        isPaid: true,
        paidAt: new Date(),
        paymentResult,
      },
    });
  });

  //get updated order after transaction
  const updatedOrder = await prisma.order.findFirst({
    where: {
      id: orderId,
    },
    include: {
      orderitems: true,
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  if (!updatedOrder) throw new Error("Order not found");
};

export const getMyOrders = async ({
  limit = PAGE_SIZE,
  page,
}: {
  limit?: number;
  page: number;
}) => {
  const session = await auth();
  if (!session) throw new Error("User is not authorized");

  const data = await prisma.order.findMany({
    where: {
      userId: session?.user?.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
    skip: (page - 1) * limit,
  });

  const dataCount = await prisma.order.count({
    where: {
      userId: session.user?.id,
    },
  });

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  };
};

type SalesDataType = {
  month: string;
  totalSales: number;
}[];

export const getOrderSummary = async () => {
  //get counts for each resource
  const ordersCount = await prisma.order.count();
  const productsCount = await prisma.product.count();
  const usersCount = await prisma.user.count();

  //calculate total sales
  const totalSales = await prisma.order.aggregate({
    _sum: { totalPrice: true },
  });

  //get monthly sales
  const salesDataRaw = await prisma.$queryRaw<
    Array<{ month: string; totalSales: Prisma.Decimal }>
  >`SELECT to_char("createdAt", 'MM/YY') as "month", sum("totalPrice") as "totalSales" FROM "Order" GROUP BY to_char("createdAt",'MM/YY')`;

  const salesData: SalesDataType = salesDataRaw.map((entry) => ({
    month: entry.month,
    totalSales: Number(entry.totalSales),
  }));

  //get latest sales
  const latestSales = await prisma.order.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
    take: 6,
  });

  return {
    ordersCount,
    productsCount,
    usersCount,
    totalSales,
    latestSales,
    salesData,
  };
};

export async function getAllOrders({
  limit = PAGE_SIZE,
  page,
  query,
}: {
  limit?: number;
  page: number;
  query: string;
}) {
  const queryFilter: Prisma.OrderWhereInput =
    query && query !== "all"
      ? {
          user: {
            name: {
              contains: query,
              mode: "insensitive",
            } as Prisma.StringFilter,
          },
        }
      : {};

  const data = await prisma.order.findMany({
    where: {
      ...queryFilter,
    },
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: (page - 1) * limit,
    include: { user: { select: { name: true } } },
  });

  const dataCount = await prisma.order.count();

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  };
}

export const deleteOrder = async (orderId: string) => {
  try {
    await prisma.order.delete({
      where: {
        id: orderId,
      },
    });

    revalidatePath(paths.adminOrders());
    return {
      success: true,
      message: "Order deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
};

export const updateOrderToPaidCOD = async (orderId: string) => {
  try {
    await updateOrderToPaid({ orderId });
    revalidatePath(paths.order(orderId));
    return {
      success: true,
      message: "Order marked as paid",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
};

export const deliverOrder = async (orderId: string) => {
  try {
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
      },
    });

    if (!order) throw new Error("Order not found");

    if (!order.isPaid) throw new Error("Order has not been paid");

    await prisma.order.update({
      where: { id: orderId },
      data: { isDelivered: true, deliveredAt: new Date() },
    });

    revalidatePath(paths.order(orderId));
    return {
      success: true,
      message: "Order marked as paid",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
};
