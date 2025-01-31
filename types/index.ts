import {z} from 'zod'
import {insertProductSchema, cartItemSchema, insertCartSchema} from '../lib/validators'

export type Product = z.infer<typeof insertProductSchema> &  {
    id: string;
    rating: string;
    numReviews: number;
    createdAt: Date;
}

export type Cart = z.infer<typeof insertCartSchema> &{
    id: string;
}
export type CartItem = z.infer<typeof cartItemSchema>
