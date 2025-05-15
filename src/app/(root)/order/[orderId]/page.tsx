import { Metadata } from "next";
import { getOrderById } from "@/lib/actions/order.actions";
import { notFound } from "next/navigation";
import { ShippingAddress } from "@/types";
import OrderDetailsTable from "./order-details-table";
import { auth } from "@/auth";
import Stripe from "stripe";

export const metadata: Metadata = {
  title: "Order Details",
};

interface OrderPageProps {
  params: Promise<{ orderId: string }>;
}

const OrderPage = async ({ params }: OrderPageProps) => {
  const { orderId } = await params;

  const order = await getOrderById(orderId);

  if (!order) notFound();

  const session = await auth();

  let client_secret = null;

  //check if is not paid and using stripe
  if (order.paymentMethod === "Stripe" && !order.isPaid) {
    //initialize stripe instance
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

    //create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(Number(order.totalPrice) * 100),
      currency: "USD",
      metadata: { orderId: order.id },
    });

    client_secret = paymentIntent.client_secret;
  }

  return (
    <div>
      <OrderDetailsTable
        order={{
          ...order,
          shippingAddress: order.shippingAddress as ShippingAddress,
        }}
        stripeClientSecret={client_secret}
        paypalClientId={process.env.PAYPAL_CLIENT_ID || "sb"}
        isAdmin={session?.user.role === "admin" || false}
      />
    </div>
  );
};

export default OrderPage;
