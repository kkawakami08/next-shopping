"use server";
import { prisma } from "@/db/prisma";
import { convertToPlainObject, formatError } from "../utils";
import { LATEST_PRODUCTS_LIMIT, PAGE_SIZE, paths } from "../constants";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { InsertProductSchema, UpdateProductSchema } from "../validators";
import { Prisma } from "@/generated/prisma";
//Get Latest Products
export const getLatestProducts = async () => {
  const data = await prisma.product.findMany({
    take: LATEST_PRODUCTS_LIMIT,
    orderBy: { createdAt: "desc" },
  });
  return convertToPlainObject(data);
};

// Get single product by its slug
export const getProductBySlug = async (slug: string) => {
  return await prisma.product.findFirst({
    where: {
      slug,
    },
  });
};
export const getProductById = async (productId: string) => {
  const data = await prisma.product.findFirst({
    where: {
      id: productId,
    },
  });

  return convertToPlainObject(data);
};

export const getAllProducts = async ({
  query,
  limit = PAGE_SIZE,
  page,
}: // category,
{
  query: string;
  limit?: number;
  page: number;
  category?: string;
}) => {
  // Query filter
  const queryFilter: Prisma.ProductWhereInput =
    query && query !== "all"
      ? {
          name: {
            contains: query,
            mode: "insensitive",
          } as Prisma.StringFilter,
        }
      : {};
  const data = await prisma.product.findMany({
    where: {
      ...queryFilter,
    },
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * limit,
    take: limit,
  });

  const dataCount = await prisma.product.count();

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  };
};

export const deleteProduct = async (productId: string) => {
  try {
    const productExist = await prisma.product.findFirst({
      where: { id: productId },
    });

    if (!productExist) throw new Error("Could not find product");

    await prisma.product.delete({
      where: { id: productId },
    });

    revalidatePath(paths.adminProducts());

    return {
      success: true,
      message: "Product deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
};

export const createProduct = async (
  data: z.infer<typeof InsertProductSchema>
) => {
  try {
    const product = InsertProductSchema.parse(data);

    await prisma.product.create({
      data: product,
    });

    revalidatePath(paths.adminProducts());
    return {
      success: true,
      message: "Product created successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
};
export const updateProduct = async (
  data: z.infer<typeof UpdateProductSchema>
) => {
  try {
    const product = UpdateProductSchema.parse(data);

    const productExists = await prisma.product.findFirst({
      where: {
        id: product.id,
      },
    });

    if (!productExists) throw new Error("Product not found");

    await prisma.product.update({
      where: {
        id: product.id,
      },
      data: product,
    });

    revalidatePath(paths.adminProducts());
    return {
      success: true,
      message: "Product updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
};

export const getAllCategories = async () => {
  const data = await prisma.product.groupBy({
    by: ["category"],
    _count: true,
  });

  return data;
};

export const getFeaturedProducts = async () => {
  const data = await prisma.product.findMany({
    where: {
      isFeatured: true,
    },
    take: 4,
    orderBy: {
      createdAt: "desc",
    },
  });

  return convertToPlainObject(data);
};
