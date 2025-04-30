"use client";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import React from "react";
import LoadingSpinner from "@/components/loading-spinner";

interface SubmitButtonProps {
  label: string;
}

const SubmitButton = ({ label }: SubmitButtonProps) => {
  const { pending } = useFormStatus();
  return (
    <Button className="w-full" disabled={pending}>
      {pending && <LoadingSpinner className="mr-2" />}
      {label}
    </Button>
  );
};

export default SubmitButton;
