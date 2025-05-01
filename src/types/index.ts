import { z } from "zod";
import {
  CartItemSchema,
  InsertCartSchema,
  InsertProductSchema,
} from "@/lib/validators";

export type Product = z.infer<typeof InsertProductSchema> & {
  id: string;
  rating: string;
  createdAt: Date;
};

export type Cart = z.infer<typeof InsertCartSchema>;

export type CartItem = z.infer<typeof CartItemSchema>;
