"use server";
import { prisma } from "@/db/prisma";
import { cookies } from "next/headers";
import { CartItem } from "@/types";
import { convertToPlainObject, formatError, round2 } from "../utils";
import { auth } from "@/auth";
import { CartItemSchema, InsertCartSchema } from "../validators";
import { revalidatePath } from "next/cache";
import { paths } from "../constants";

//calculate cart prices
const calcPrice = (items: CartItem[]) => {
  const itemsPrice = round2(
    items.reduce((acc, item) => acc + Number(item.price) * item.qty, 0)
  );
  const shippingPrice = round2(itemsPrice > 100 ? 0 : 10);
  const taxPrice = round2(0.15 * itemsPrice);
  const totalPrice = round2(itemsPrice + shippingPrice + taxPrice);

  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice: taxPrice.toFixed(2),
    totalPrice: totalPrice.toFixed(2),
  };
};

export const addItemToCart = async (data: CartItem) => {
  try {
    //check for cart cookie
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;

    if (!sessionCartId) throw new Error("Cart Session not found");

    //get session and user ID
    const session = await auth();
    const userId = session?.user?.id ? (session.user.id as string) : undefined;

    //get cart
    const cart = await getMyCart();

    // parse and validate item
    const item = CartItemSchema.parse(data);

    //find product in DB
    const product = await prisma.product.findFirst({
      where: { id: item.productId },
    });

    if (!product) throw new Error("Product not found");

    if (!cart) {
      const newCart = InsertCartSchema.parse({
        userId,
        items: [item],
        sessionCartId,
        ...calcPrice([item]),
      });

      //Add to DB
      await prisma.cart.create({
        data: newCart,
      });

      //revalidate product page
      revalidatePath(paths.product(product.slug));
      return {
        success: true,
        message: `${product.name} added to cart`,
      };
    } else {
      // Check if item is already in the cart
      const existItem = (cart.items as CartItem[]).find(
        (x) => x.productId === item.productId
      );

      if (existItem) {
        // check stock
        if (product.stock < existItem.qty + 1) {
          throw new Error("Not enough stock");
        }

        //increase qty
        (cart.items as CartItem[]).find(
          (x) => x.productId === item.productId
        )!.qty = existItem.qty + 1;
      } else {
        //if item doesn't' exist in cart
        //check stock
        if (product.stock < 1) throw new Error("Not enough stock");

        //add item to cart.items
        cart.items.push(item);
      }

      //save to db
      await prisma.cart.update({
        where: {
          id: cart.id,
        },
        data: {
          items: cart.items,
          ...calcPrice(cart.items as CartItem[]),
        },
      });
      revalidatePath(paths.product(product.slug));
      return {
        success: true,
        message: `${product.name} ${
          existItem ? "updated in" : "added to"
        } cart`,
      };
    }
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
};

export const getMyCart = async () => {
  //check for cart cookie
  const sessionCartId = (await cookies()).get("sessionCartId")?.value;

  if (!sessionCartId) throw new Error("Cart Session not found");

  //get session and user ID
  const session = await auth();
  const userId = session?.user?.id ? (session.user.id as string) : undefined;

  // get user cart from DB
  const cart = await prisma.cart.findFirst({
    where: userId ? { userId } : { sessionCartId },
  });

  if (!cart) return undefined;

  // Convert decimals and return
  return convertToPlainObject({
    ...cart,
    items: cart.items as CartItem[],
    itemsPrice: cart.itemsPrice.toString(),
    totalPrice: cart.totalPrice.toString(),
    shippingPrice: cart.shippingPrice.toString(),
    taxPrice: cart.taxPrice.toString(),
  });
};

export const removeItemFromCart = async (productId: string) => {
  try {
    //check for cart cookie
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;
    if (!sessionCartId) throw new Error("Cart Session not found");

    //get product
    const product = await prisma.product.findFirst({
      where: {
        id: productId,
      },
    });

    if (!product) throw new Error("Product not found");

    //get user cart
    const cart = await getMyCart();

    if (!cart) throw new Error("Could not find cart");

    // check for item in cart
    const exist = (cart.items as CartItem[]).find(
      (x) => x.productId === productId
    );
    if (!exist) throw new Error("Could not find item in cart");

    //check if cart has only 1 of said item
    if (exist.qty === 1) {
      //remove from cart
      cart.items = (cart.items as CartItem[]).filter(
        (x) => x.productId !== exist.productId
      );
    } else {
      //decrease qty
      (cart.items as CartItem[]).find((x) => x.productId === productId)!.qty =
        exist.qty - 1;
    }

    //update cart in DB
    await prisma.cart.update({
      where: {
        id: cart.id,
      },
      data: {
        items: cart.items,
        ...calcPrice(cart.items as CartItem[]),
      },
    });
    revalidatePath(paths.product(product.slug));

    return {
      success: true,
      message: `${product.name} was removed from the cart`,
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
};
