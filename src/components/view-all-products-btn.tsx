import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { paths } from "@/lib/constants";

const ViewAllProductsButton = () => {
  return (
    <div className="flex justify-center items-center my-8">
      <Button asChild className="px-8 py-4 text-lg font-semibold">
        <Link href={paths.search()}>View All Products</Link>
      </Button>
    </div>
  );
};

export default ViewAllProductsButton;
