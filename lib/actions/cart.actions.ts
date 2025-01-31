'use server';

import { CartItem } from '@/types';
import { cookies } from 'next/headers';
import { convertToPlainObject, formatError, roundNumber } from '../utils';
import { COOKIE_NAMES } from '../constants';
import { auth } from '@/auth';
import { prisma } from '@/db/prisma';
import { cartItemSchema, insertCartSchema } from '../validators';
import { revalidatePath } from 'next/cache';

const calcPrice = (items: CartItem[]) => {
  const itemsPrice = roundNumber(
      items.reduce((acc, item) => acc + Number(item.price) * item.quantity, 0),
    ),
    shippingPrice = roundNumber(itemsPrice > 100 ? 0 : 10),
    taxPrice = roundNumber(0.15 * itemsPrice),
    totalPrice = roundNumber(itemsPrice + shippingPrice + taxPrice);
  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice: taxPrice.toFixed(2),
    totalPrice: totalPrice.toFixed(2),
  };
};

export async function addItemToCart(data: CartItem) {
  try {
    //Check for the cart cookie
    const sessionCartId = (await cookies()).get(
      COOKIE_NAMES.SESSION_CART_ID,
    )?.value;
    if (!sessionCartId) {
      throw new Error('Session cart not found');
    }

    //get user id
    const session = await auth();
    const userId = session?.user?.id ? (session.user.id as string) : undefined;

    // get cart
    const cart = await getMyCart();
    const item = cartItemSchema.parse(data);
    console.log(cart);

    //find product

    const product = await prisma.product.findFirst({
      where: { id: item.productId },
    });

    if (!product) {
      throw new Error('Product not found');
    }
    if (!cart) {
      //create cart object
      const newCart = insertCartSchema.parse({
        sessionCartId: sessionCartId,
        userId,
        items: [item],
        ...calcPrice([item]),
      });
      await prisma.cart.create({ data: newCart });

      //Revalidate product page to refresh caching and cart count
      revalidatePath(`/product/${product.slug}`);

      return {
        success: true,
        message: 'Item added to the cart',
      };
    } else {
    }

    return {
      success: true,
      message: 'Item added to the cart',
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

export async function getMyCart() {
  const sessionCartId = (await cookies()).get(
    COOKIE_NAMES.SESSION_CART_ID,
  )?.value;
  if (!sessionCartId) {
    throw new Error('Session cart not found');
  }

  //get user id
  const session = await auth();
  const userId = session?.user?.id ? (session.user.id as string) : undefined;

  // get user cart from db by user or sessionId
  const cart = await prisma.cart.findFirst({
    where: userId ? { userId } : { sessionCartId },
  });

  if (!cart) {
    return undefined;
  }

  return convertToPlainObject({
    ...cart,
    items: cart.items as CartItem[],
    itemsPrice: cart.itemsPrice.toString(),
    totalPrice: cart.totalPrice.toString(),
    shippingPrice: cart.shippingPrice.toString(),
    taxPrice: cart.taxPrice.toString(),
  });
}
