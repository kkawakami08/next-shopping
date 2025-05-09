import ProductForm from "@/components/admin/product-form";
import { getProductById } from "@/lib/actions/product.actions";
import { requireAdmin } from "@/lib/auth-guard";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import React from "react";

export const metadata: Metadata = {
  title: "Update Product",
};

interface UpdateProductProps {
  params: Promise<{ id: string }>;
}

const UpdateProduct = async ({ params }: UpdateProductProps) => {
  const { id } = await params;

  const product = await getProductById(id);

  if (!product) notFound();

  await requireAdmin();
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold">Update Product</h1>
      <ProductForm type="Update" product={product} productId={product.id} />
    </div>
  );
};

export default UpdateProduct;
