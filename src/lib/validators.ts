import { z } from "zod";
import { formatNumberWithDecimal } from "./utils";
import { PAYMENT_METHODS } from "./constants";

const currency = z
  .string()
  .refine(
    (value) => /^\d+(\.\d{2})?$/.test(formatNumberWithDecimal(Number(value))),
    "Price must have exactly 2 decimal places"
  );

// schema for inserting products
// Schema for inserting products
export const InsertProductSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  slug: z.string().min(3, "Slug must be at least 3 characters"),
  category: z.string().min(3, "Category must be at least 3 characters"),
  brand: z.string().min(3, "Brand must be at least 3 characters"),
  description: z.string().min(3, "Description must be at least 3 characters"),
  stock: z.coerce.number(),
  images: z.array(z.string()).min(1, "Product must have at least one image"),
  isFeatured: z.boolean(),
  banner: z.string().nullable(),
  price: currency,
});

// Schema for updating products
export const UpdateProductSchema = InsertProductSchema.extend({
  id: z.string().min(1, "Id is required").optional(),
});

export const SignInFormSchema = z.object({
  email: z.string().email("Invalid Email Address"),
  password: z.string().min(6, "Password must have at least 6 characters"),
});

export const SignUPFormSchema = z
  .object({
    name: z.string().min(3, "Name must contain at least 3 characters"),
    email: z.string().email("Invalid Email Address"),
    password: z.string().min(6, "Password must have at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Confirm password must have at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    //if not matching passwords, will show in "confirmPassword" path/field
    path: ["confirmPassword"],
  });

export const CartItemSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  qty: z.number().int().nonnegative("Quantity must be a positive number"),
  image: z.string().min(1, "Image is required"),
  price: currency,
});

export const InsertCartSchema = z.object({
  items: z.array(CartItemSchema),
  itemsPrice: currency,
  totalPrice: currency,
  shippingPrice: currency,
  taxPrice: currency,
  sessionCartId: z.string().min(1, "Session cart id is required"),
  userId: z.string().optional().nullable(),
});

export const ShippingAddressSchema = z.object({
  fullName: z.string().min(3, "Name must have at least 3 characters"),
  streetAddress: z
    .string()
    .min(3, "Street address must have at least 3 characters"),
  city: z.string().min(3, "City must have at least 3 characters"),
  postalCode: z.string().min(3, "Postal Code must have at least 3 characters"),
  country: z.string().min(3, "Country must have at least 3 characters"),
  lat: z.number().optional(),
  lng: z.number().optional(),
});

export const PaymentMethodSchema = z
  .object({
    type: z.string().min(1, "Payment method is required"),
  })
  .refine((data) => PAYMENT_METHODS.includes(data.type), {
    path: ["type"],
    message: "Invalid payment method",
  });

export const InsertOrderSchema = z.object({
  userId: z.string().min(1, "User is required"),
  itemsPrice: currency,
  shippingPrice: currency,
  taxPrice: currency,
  totalPrice: currency,
  paymentMethod: z.string().refine((data) => PAYMENT_METHODS.includes(data), {
    message: "Invalid payment method",
  }),
  shippingAddress: ShippingAddressSchema,
});

export const InsertOrderItemSchema = z.object({
  productId: z.string(),
  slug: z.string(),
  image: z.string(),
  name: z.string(),
  price: currency,
  qty: z.number(),
});

export const PaymentResultSchema = z.object({
  id: z.string(),
  status: z.string(),
  email_address: z.string(),
  pricePaid: z.string(),
});

export const UpdateProfileSchema = z.object({
  name: z.string().min(3, "Name must contain at least 3 characters"),
  email: z.string().min(3, "Email must have at least 3 characters").email(),
});

export const UpdateUserSchema = UpdateProfileSchema.extend({
  id: z.string().min(1, "ID is required"),
  role: z.string().min(1, "Role is required"),
});

export const InsertReviewSchema = z.object({
  title: z.string().min(3, "Title must have at least 3 characters"),
  description: z.string().min(3, "Description must have at least 3 characters"),
  productId: z.string().min(1, "Product is required"),
  userId: z.string().min(1, "User is required"),
  rating: z.coerce
    .number()
    .int()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating can be at most 5"),
});
