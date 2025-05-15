import { Button } from "@/components/ui/button";
import { getOrderById } from "@/lib/actions/order.actions";
import { paths } from "@/lib/constants";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

const SuccessPage = async (props: {
  params: Promise<{ orderId: string }>;
  searchParams: Promise<{ payment_intent: string }>;
}) => {
  const { orderId } = await props.params;
  const { payment_intent: paymentIntentId } = await props.searchParams;

  //get order
  const order = await getOrderById(orderId);
  if (!order) notFound();

  //retrieve payment intent
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

  //check if payment intent is valid
  if (
    paymentIntent.metadata.orderId == null ||
    paymentIntent.metadata.orderId !== order.id.toString()
  ) {
    return notFound();
  }

  //check if payment is successful
  const isSuccess = paymentIntent.status === "succeeded";
  if (!isSuccess) return redirect(paths.order(orderId));

  return (
    <div className="max-w-4xl w-full mx-auto space-y-8">
      <div className="flex flex-col gap-6 items-center">
        <h1 className="font-bold text-2xl">Thanks for your purchase!</h1>
        <div>We are processing your order.</div>
        <Button asChild>
          <Link href={paths.order(orderId)}>View Order</Link>
        </Button>
      </div>
    </div>
  );
};

export default SuccessPage;
