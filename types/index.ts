import { z } from 'zod';
import {
  insertProductSchema,
  cartItemSchema,
  insertCartSchema,
  shippingAddressSchema,
  paymentMethodSchema,
  insertOrderSchema,
  insertOrderItemSchema,
  paymentResultSchema,
} from '../lib/validators';

export type Product = z.infer<typeof insertProductSchema> & {
  id: string;
  rating: string;
  numReviews: number;
  createdAt: Date;
};

export type Cart = z.infer<typeof insertCartSchema> & {
  id: string;
};
export type CartItem = z.infer<typeof cartItemSchema>;

export type ShippingAddress = z.infer<typeof shippingAddressSchema>;

export type PaymentMethod = z.infer<typeof paymentMethodSchema>;

export type OrderItem = z.infer<typeof insertOrderItemSchema>;

export type Order = z.infer<typeof insertOrderSchema> & {
  id: string;
  createdAt: Date;
  isPaid: boolean ;
  paidAt: Date | null;
  isDelivered: boolean;
  deliveredAt: Date | null;
  paymentResult: PaymentResult;
  orderItems: OrderItem[];
};

export type PaymentResult = z.infer<typeof paymentResultSchema>;

