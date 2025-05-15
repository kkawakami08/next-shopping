"use client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTransition } from "react";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.actions";
import { ArrowRight, Minus, Plus } from "lucide-react";
import LoadingSpinner from "@/components/loading-spinner";
import Link from "next/link";
import Image from "next/image";
import { Cart } from "@/types";
import { paths } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface CartTableProps {
  cart?: Cart;
}

const CartTable = ({ cart }: CartTableProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <>
      <h1 className="py-4 text-2xl font-semibold">Shopping Cart</h1>
      {!cart || cart.items.length === 0 ? (
        <div className="flex flex-col gap-2 ">
          Cart is empty
          <Button asChild className="w-40">
            <Link href={paths.home()}>
              Go Shopping! <ArrowRight />
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5">
          <div className="overflow-x-auto md:col-span-3">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead className="text-center">Quantity</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cart.items.map((item) => (
                  <TableRow key={item.slug}>
                    <TableCell>
                      <Link
                        href={paths.product(item.slug)}
                        className="flex items-center"
                      >
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={50}
                          height={50}
                        />
                        <span className="px-2">{item.name}</span>
                      </Link>
                    </TableCell>
                    <TableCell className="flex items-center justify-center gap-2">
                      <Button
                        size={"icon"}
                        disabled={isPending}
                        variant={"outline"}
                        type="button"
                        onClick={() =>
                          startTransition(async () => {
                            const res = await removeItemFromCart(
                              item.productId
                            );
                            if (!res.success) {
                              toast.error(res.message);
                            }
                          })
                        }
                      >
                        {isPending ? (
                          <LoadingSpinner className="size-4" />
                        ) : (
                          <Minus className="size-4" />
                        )}
                      </Button>
                      <span>{item.qty}</span>
                      <Button
                        size={"icon"}
                        disabled={isPending}
                        variant={"outline"}
                        type="button"
                        onClick={() =>
                          startTransition(async () => {
                            const res = await addItemToCart(item);
                            if (!res.success) {
                              toast.error(res.message);
                            }
                          })
                        }
                      >
                        {isPending ? (
                          <LoadingSpinner className="size-4" />
                        ) : (
                          <Plus className="size-4" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell className="text-right">${item.price}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <Card>
            <CardContent className="p-4 gap-4">
              <div className="pb-3 text-xl flex justify-between">
                Subtotal: (
                {cart.items.reduce(
                  (acc, currentVal) => acc + currentVal.qty,
                  0
                )}
                )
                <span className="font-bold">
                  {formatCurrency(cart.itemsPrice)}
                </span>
              </div>
              <Button
                className="w-full "
                disabled={isPending}
                onClick={() => {
                  startTransition(() => {
                    router.push(paths.shipping());
                  });
                }}
              >
                {" "}
                Proceed to Checkout
                {isPending ? (
                  <LoadingSpinner className="size-4" />
                ) : (
                  <ArrowRight className="size-4" />
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default CartTable;
