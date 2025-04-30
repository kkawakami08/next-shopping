import { Button } from "@/components/ui/button";
import Link from "next/link";
import { paths } from "@/lib/constants";
import { EllipsisVertical, ShoppingCart } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import UserButton from "./user-button";

const Menu = () => {
  return (
    <div className="flex justify-end gap-3">
      <nav className="hidden md:flex w-full max-w-xs gap-1">
        <ThemeToggle />
        <Button asChild variant={"ghost"}>
          <Link href={paths.cart()}>
            <ShoppingCart /> Cart
          </Link>
        </Button>
        <UserButton />
      </nav>
      <nav className="md:hidden ">
        <Sheet>
          <SheetTrigger className="align-middle cursor-pointer ">
            <EllipsisVertical />
          </SheetTrigger>
          <SheetContent className="flex flex-col items-start p-5">
            <SheetTitle>Menu</SheetTitle>
            <ThemeToggle />
            <Button asChild variant={"ghost"}>
              <Link href={paths.cart()}>
                <ShoppingCart /> Cart
              </Link>
            </Button>
            <UserButton />
            <SheetDescription></SheetDescription>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
};

export default Menu;
