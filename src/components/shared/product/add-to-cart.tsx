"use client";
import { Cart, CartItem } from "@/types";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Plus, Minus } from "lucide-react";
import { toast } from "sonner";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.actions";
import { paths } from "@/lib/constants";
import { useTransition } from "react";
import LoadingSpinner from "@/components/loading-spinner";

interface AddToCartProps {
  item: CartItem;
  cart?: Cart;
}

const AddToCart = ({ item, cart }: AddToCartProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleAddToCart = async () => {
    startTransition(async () => {
      const res = await addItemToCart(item);

      if (!res.success) {
        toast.error(res.message);
        return;
      }

      //handle success add to cart
      toast(res.message, {
        action: {
          label: "Go to cart",
          onClick: () => router.push(paths.cart()),
        },
      });
    });
  };

  //handle remove from cart
  const handleRemoveFromCart = async () => {
    startTransition(async () => {
      const res = await removeItemFromCart(item.productId);
      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
      return;
    });
  };

  //Check if item is in cart
  const existItem =
    cart && cart.items.find((x) => x.productId === item.productId);

  return existItem ? (
    <div className="w-full  flex justify-center gap-2 items-center">
      <Button
        type="button"
        variant={"outline"}
        onClick={handleRemoveFromCart}
        disabled={isPending}
      >
        {isPending ? (
          <LoadingSpinner className="size-4" />
        ) : (
          <Minus className="size-4" />
        )}
      </Button>
      <span className="px-2">{existItem.qty}</span>
      <Button
        type="button"
        variant={"outline"}
        onClick={handleAddToCart}
        disabled={isPending}
      >
        {isPending ? (
          <LoadingSpinner className="size-4" />
        ) : (
          <Plus className="size-4" />
        )}
      </Button>
    </div>
  ) : (
    <Button
      className="w-full mt-2"
      type="button"
      onClick={handleAddToCart}
      disabled={isPending}
    >
      {isPending ? (
        <LoadingSpinner className="size-4" />
      ) : (
        <Plus className="size-4" />
      )}{" "}
      Add To Cart
    </Button>
  );
};

export default AddToCart;
