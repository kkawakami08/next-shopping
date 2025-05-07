import { z } from "zod";
import {
  CartItemSchema,
  InsertCartSchema,
  InsertProductSchema,
  ShippingAddressSchema,
  InsertOrderItemSchema,
  InsertOrderSchema,
  PaymentResultSchema,
} from "@/lib/validators";

export type Product = z.infer<typeof InsertProductSchema> & {
  id: string;
  rating: string;
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
};

export type PaymentResult = z.infer<typeof PaymentResultSchema>;
