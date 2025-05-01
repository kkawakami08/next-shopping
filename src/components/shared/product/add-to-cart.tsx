"use client";
import { CartItem } from "@/types";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { addItemToCart } from "@/lib/actions/cart.actions";
import { paths } from "@/lib/constants";

interface AddToCartProps {
  item: CartItem;
}

const AddToCart = ({ item }: AddToCartProps) => {
  const router = useRouter();

  const handleAddToCart = async () => {
    const res = await addItemToCart(item);

    if (!res.success) {
      toast.error(res.message);
      return;
    }

    //handle success add to cart
    toast(`${item.name} added to cart`, {
      action: {
        label: "Go to cart",
        onClick: () => router.push(paths.cart()),
      },
    });
  };

  return (
    <Button className="w-full mt-2" type="button" onClick={handleAddToCart}>
      <Plus /> Add To Cart
    </Button>
  );
};

export default AddToCart;
