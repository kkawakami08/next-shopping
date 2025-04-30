import { cn } from "@/lib/utils";
import { Loader } from "lucide-react";
import React from "react";

interface LoadingSpinnerProps {
  className?: string;
}

const LoadingSpinner = ({ className }: LoadingSpinnerProps) => {
  return <Loader className={cn("animate-spin", className)} />;
};

export default LoadingSpinner;
