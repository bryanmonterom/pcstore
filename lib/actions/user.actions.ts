'use server';

import {
  paymentMethodSchema,
  shippingAddressSchema,
  signInFormShema,
  signUpFormShema,
  updateUserSchema,
} from '../validators';
import { auth, signIn, signOut } from '@/auth';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { hashSync } from 'bcrypt-ts-edge';
import { prisma } from '@/db/prisma';
import { formatError } from '../utils';
import { PaymentMethod, ShippingAddress } from '@/types';
import { PAGE_SIZE } from '../constants';
import { flushAllTraces } from 'next/dist/trace';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

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

//get all users
export async function getAllUsers({
  limit = PAGE_SIZE,
  page,
}: {
  limit?: number;
  page: number;
}) {
  const data = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    skip: (page - 1) * limit,
  });

  const dataCount = await prisma.user.count();
  return { totalPages: dataCount / limit, data };
}

export async function deleteUser(id: string) {
  try {
    await prisma.user.delete({
      where: { id },
    });

    revalidatePath('/admin/users');
    return { success: true, message: 'User deleted succesfully' };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

//Update a user
export async function updateUser(user: z.infer<typeof updateUserSchema>) {
  try {
    await prisma.user.update({
      where: { id: user.id },
      data: { name: user.name, role: user.role },
    });
    revalidatePath('/admin/users')
    return { success: true, message: 'User updates succesfully' };

  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}
