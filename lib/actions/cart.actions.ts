'use server';

import { Cart, CartItem, Product } from '@/types';
import { cookies } from 'next/headers';
import { convertToPlainObject, formatError, roundNumber } from '../utils';
import { COOKIE_NAMES } from '../constants';
import { auth } from '@/auth';
import { prisma } from '@/db/prisma';
import { cartItemSchema, insertCartSchema } from '../validators';
import { revalidatePath } from 'next/cache';
import { Prisma } from '@prisma/client';

export async function addItemToCart(data: CartItem) {
  try {
    //Check for the cart cookie
    const sessionCartId = await getSessionCardId();

    //get user id
    const userId = await getUserId();

    // get cart
    const cart = await getMyCart();
    const item = cartItemSchema.parse(data);

    //find product
    const product = await getProduct(item.productId);

    if (!cart) {
      //If cart doesnt exist, create a new one and add the item
      return await createCart(sessionCartId, userId, item, product);
    } else {
      //Check if items exists in the cart, if yes, update it if not add it
      return await updateCart(cart, item, product);
    }
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

export async function getMyCart() {
  const sessionCartId = await getSessionCardId();

  //get user id
  const userId = await getUserId();

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

export async function removeItemFromCart(productId: string) {
  try {
    const product = await getProduct(productId);

    const cart = await getMyCart();
    if (!cart) {
      throw new Error('Cart not found');
    }

    const exists = cart.items.find((x) => x.productId === productId);
    if (!exists) {
      throw new Error('Item not found');
    }

    if (exists.quantity === 1) {
      //to filter out the product from the cart items array
      cart.items = cart.items.filter((x) => x.productId !== productId);
    } else {
      cart.items.find((x) => x.productId === productId)!.quantity -= 1;
    }

    await updateCartInDb(cart, product);
    return {
        success: true,
        message: `${product.name} was removed from the cart`,
      };

  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}
//private functions
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
async function getUserId() {
  const session = await auth();
  const userId = session?.user?.id ? (session.user.id as string) : undefined;
  return userId;
}

async function getSessionCardId() {
  const sessionCartId = (await cookies()).get(
    COOKIE_NAMES.SESSION_CART_ID,
  )?.value;
  if (!sessionCartId) {
    throw new Error('Session cart not found');
  }
  return sessionCartId;
}

async function updateCart(cart: Cart, item: CartItem, product: Product) {
  const existsItem = (cart.items as CartItem[]).find(
    (x) => x.productId === item.productId,
  );
  if (existsItem) {
    //Check stock
    if (product.stock < existsItem.quantity + 1) {
      throw new Error('Not enough stock');
    }

    //Increase quantity
    (cart.items as CartItem[]).find(
      (x) => x.productId === item.productId,
    )!.quantity = existsItem.quantity + 1;
  } else {
    //Check stock
    if (product.stock < 1) {
      throw new Error('Not enough stock');
    }

    //add new item
    cart.items.push(item);
  }

  await updateCartInDb(cart, product);
  return {
    success: true,
    message: `${product.name} ${
      existsItem ? 'quantity increased' : 'added to the cart'
    }`,
  };
}

async function updateCartInDb(cart: Cart, product: Product) {
    await prisma.cart.update({
        where: { id: cart.id },
        data: {
            items: cart.items as Prisma.CartUpdateitemsInput[],
            ...calcPrice(cart.items as CartItem[]),
        },
    });
    revalidatePath(`/product/${product.slug}`);
}

async function createCart(
  sessionCartId: string,
  userId: string | undefined,
  item: CartItem,
  product: Product,
) {
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
    message: `${product.name} added to the cart`,
  };
}

async function getProduct(productId: string) {
  const product = await prisma.product.findFirst({
    where: { id: productId },
  });

  if (!product) {
    throw new Error('Product not found');
  }
  return product;
}
