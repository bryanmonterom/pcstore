'use server';

import { signInFormShema, signUpFormShema } from '../validators';
import { signIn, signOut } from '@/auth';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { hashSync } from 'bcrypt-ts-edge';
import { prisma } from '@/db/prisma';

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

export async function signUpUser(prevState: unknown, formData:FormData){

  try {
    const user = signUpFormShema.parse({
      name:formData.get('name'),
      email:formData.get('email'),
      password:formData.get('password'),
      confirmPassword:formData.get('confirmPassword'),

    });

    const plainPassword = user.password
    user.password = hashSync(user.password, 10)
    await prisma.user.create({
      data:{
        name:user.name,
        email:user.email,
        password:user.password
      }
    })

    await signIn('credentials',{
      email:user.email,
      password:plainPassword
    })

    return {success:true, message:'User registered succesfully'}

  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    console.log(error)
    return { success: false, message: 'Something failed to create the new user' };

  }
}