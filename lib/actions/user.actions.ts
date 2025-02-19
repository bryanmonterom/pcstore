'use server';

import {
  paymentMethodSchema,
  shippingAddressSchema,
  signInFormShema,
  signUpFormShema,
} from '../validators';
import { auth, signIn, signOut } from '@/auth';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { hashSync } from 'bcrypt-ts-edge';
import { prisma } from '@/db/prisma';
import { formatError } from '../utils';
import { PaymentMethod, ShippingAddress } from '@/types';

//sign in the user with credentials
export default async function signInWithCredentials(
  prevState: unknown,
  formData: FormData,
) {
  try {
    const user = signInFormShema.parse({
      email: formData.get('email'),
      password: formData.get('password'),
    });

    await signIn('credentials', user);

    return { success: true, message: 'Signed in succesfully' };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    return { success: false, message: 'Invalid email or password' };
  }
}

//Sign out user
export async function signOutUser() {
  await signOut();
}

export async function signUpUser(prevState: unknown, formData: FormData) {
  try {
    const user = signUpFormShema.parse({
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
      confirmPassword: formData.get('confirmPassword'),
    });

    const plainPassword = user.password;
    user.password = hashSync(user.password, 10);
    await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
      },
    });

    await signIn('credentials', {
      email: user.email,
      password: plainPassword,
    });

    return { success: true, message: 'User registered succesfully' };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    formatError(error);
    return {
      success: false,
      message: formatError(error),
    };
  }
}

export async function getUserById(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }
    return user;
  } catch (error) {
    return formatError(error);
  }
}

export async function updateUserAddress(data: ShippingAddress) {
  try {
    const session = await auth();

    const currentUser = await prisma.user.findFirst({
      where: { id: session?.user?.id },
    });

    if (!currentUser) {
      throw new Error('User not found');
    }

    const address = shippingAddressSchema.parse(data);

    await prisma.user.update({
      where: { id: currentUser.id },
      data: { address },
    });

    return { sucess: true, message: 'Address updated succesfully' };
  } catch (error) {
    formatError(error);
    return { success: false, message: formatError(error) };
  }
}

export async function updateUserPaymentMethod(method: PaymentMethod) {
  try {
    const session = await auth();
    const currentUser = await prisma.user.findFirst({
      where: { id: session?.user?.id },
    });

    if (!currentUser) {
      throw new Error('User not found');
    }
    method.type = method.type.trim();
    const paymentMethod = paymentMethodSchema.parse(method);
    await prisma.user.update({
      where: { id: currentUser.id },
      data: { paymentMethod: paymentMethod.type },
    });

    return { success: true, message: 'Payment method updated succesfully' };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function updateUserProfile(user: { name: string; email: string }) {
  try {
    const session = await auth();
    const currentUser = await prisma.user.findFirst({
      where: { id: session?.user?.id },
    });

    if (!currentUser) {
      throw new Error('User not found');
    }

    await prisma.user.update({
      where: { id: currentUser.id },
      data: {
        name: user.name,
      },
    });

    return { success: true, message: 'User updated' };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}
