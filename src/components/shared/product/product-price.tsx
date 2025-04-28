import { cn } from "@/lib/utils";
import React from "react";

interface ProductCardProps {
  value: number;
  className?: string;
}

const ProductPrice = ({ value, className }: ProductCardProps) => {
  //ensure two decimal places
  const stringValue = value.toFixed(2);

  //get the int & float
  const [intValue, float] = stringValue.split(".");

  return (
    <p className={cn("text-2xl", className)}>
      <span className="text-xs align-super">$</span>
      {intValue}
      <span className="text-xs align-super">.{float}</span>
    </p>
  );
};

export default ProductPrice;
