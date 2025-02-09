'use server';

import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { convertToPlainObject, formatError } from '../utils';
import { getMyCart } from './cart.actions';
import { getUserById } from './user.actions';
import { insertOrderSchema } from '../validators';
import { prisma } from '@/db/prisma';
import { auth } from '@/auth';
import { CartItem, ShippingAddress } from '@/types';
import { format } from 'path';
import { paypal } from '../paypal';

export async function createOrder() {
  try {
    const session = await auth();
    if (!session) throw new Error('User is not authenticated');

    const cart = await getMyCart();
    const userId = session?.user?.id;

    if (!userId) throw new Error('User Id not found');

    const user = await getUserById(userId);

    if (!cart || cart.items.length === 0) {
      return {
        sucess: false,
        message: 'Your cart is empty',
        redirectTo: '/cart',
      };
    }

    if (!user.address) {
      return {
        sucess: false,
        message: 'No shipping address',
        redirectTo: '/shipping-address',
      };
    }

    if (!user.paymentMethod) {
      return {
        sucess: false,
        message: 'No payment method',
        redirectTo: '/payment-method',
      };
    }

    //Create order object

    const order = insertOrderSchema.parse({
      userId: user.id,
      shippingAddress: user.address as ShippingAddress,
      paymentMethod: user.paymentMethod,
      itemsPrice: cart.itemsPrice,
      totalPrice: cart.totalPrice,
      taxPrice: cart.taxPrice,
      shippingPrice: cart.shippingPrice,
      paymentResult: '', // Add a default value for paymentResult
    });

    //Create a transaction to create order and order items in db
    const inserterOrderId = await prisma.$transaction(async (tx) => {
      const insertedOrder = await tx.order.create({ data: order });

      console.log(insertedOrder);
      for (const item of cart.items as CartItem[]) {
        await tx.orderItem.create({
          data: { ...item, price: item.price, orderId: insertedOrder.id },
        });
      }

      //Clear cart

      await tx.cart.update({
        where: { id: cart.id },
        data: {
          items: [],
          totalPrice: 0,
          taxPrice: 0,
          itemsPrice: 0,
          shippingPrice: 0,
        },
      });
      return insertedOrder.id;
    });

    if (!inserterOrderId) throw new Error('Order not created');

    return {
      sucess: true,
      message: 'Order created',
      redirectTo: `/order/${inserterOrderId}`,
    };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return { sucess: false, message: formatError(error) };
  }
}

export async function getOrderById(orderId: string) {
  const data = await prisma.order.findFirst({
    where: { id: orderId },
    include: {
      orderItems: true,
      user: { select: { name: true, email: true } },
    },
  });

  return convertToPlainObject(data);
}

//Create new paypal order
export async function createPayPalOrder(orderId: string) {
  try {
    const order = await prisma.order.findFirst({
      where: { id: orderId },
    });

    if (!order) {
      throw new Error('Order not found');
    }

    const paypalOrder = await paypal.createOrder(Number(order.totalPrice));

    //Update order with paypal results

    await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentResult: {
          id: paypalOrder.id,
          email_address: '',
          status: '',
          pricePaid: 0,
        },
      },
    });

    return {
      success: true,
      message: 'Item order created succesfully',
      data: paypalOrder.id,
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}
