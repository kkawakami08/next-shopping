import { requireAdmin } from "@/lib/auth-guard";
import React from "react";
import Link from "next/link";
import { deleteProduct, getAllProducts } from "@/lib/actions/product.actions";
import { formatCurrency, formatId } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { paths } from "@/lib/constants";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Pagination from "@/components/shared/pagination";
import DeleteDialog from "@/components/shared/delete-dialog";

interface AdminProductsPageProps {
  searchParams: Promise<{ page: string; query: string; category: string }>;
}

const AdminProductsPage = async ({ searchParams }: AdminProductsPageProps) => {
  await requireAdmin();
  const { page, query, category } = await searchParams;

  const pageNumber = Number(page) || 1;
  const searchText = query || "";
  const currentCategory = category || "";

  const products = await getAllProducts({
    query: searchText,
    page: pageNumber,
    category: currentCategory,
  });

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Products</h1>
        <Button asChild>
          <Link href={paths.adminCreateProduct()}>Create Product</Link>
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>NAME</TableHead>
            <TableHead className="text-right">PRICE</TableHead>
            <TableHead>CATEGORY</TableHead>
            <TableHead>STOCK</TableHead>
            <TableHead>RATING</TableHead>
            <TableHead className="w-[100px] ">ACTIONS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.data.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{formatId(product.id)}</TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell className="text-right">
                {formatCurrency(product.price)}
              </TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell>{product.stock}</TableCell>
              <TableCell>{product.rating}</TableCell>
              <TableCell className="flex items-center gap-1">
                <Button asChild variant={"outline"} size={"sm"}>
                  <Link href={paths.adminProductPage(product.id)}>Edit</Link>
                </Button>
                {/* delete */}
                <DeleteDialog id={product.id} action={deleteProduct} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {products.totalPages > 1 && (
        <Pagination page={pageNumber} totalPages={products.totalPages} />
      )}
    </div>
  );
};

export default AdminProductsPage;
