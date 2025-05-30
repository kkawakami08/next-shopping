import { z } from "zod";
import {
  CartItemSchema,
  InsertCartSchema,
  InsertProductSchema,
  ShippingAddressSchema,
  InsertOrderItemSchema,
  InsertOrderSchema,
  PaymentResultSchema,
  InsertReviewSchema,
} from "@/lib/validators";

export type Product = z.infer<typeof InsertProductSchema> & {
  id: string;
  rating: string;
  numReviews: number;
  createdAt: Date;
};

export type Cart = z.infer<typeof InsertCartSchema>;

export type CartItem = z.infer<typeof CartItemSchema>;

export type ShippingAddress = z.infer<typeof ShippingAddressSchema>;

export type OrderItem = z.infer<typeof InsertOrderItemSchema>;
export type Order = z.infer<typeof InsertOrderSchema> & {
  id: string;
  createdAt: Date;
  isPaid: boolean;
  paidAt: Date | null;
  isDelivered: boolean;
  deliveredAt: Date | null;
  orderitems: OrderItem[];
  user: { name: string; email: string };
  paymentResult: PaymentResult;
};

export type PaymentResult = z.infer<typeof PaymentResultSchema>;

export type Review = z.infer<typeof InsertReviewSchema> & {
  id: string;
  createdAt: Date;
  user?: { name: string };
};
