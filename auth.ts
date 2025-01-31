import NextAuth, { NextAuthConfig } from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from './db/prisma';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compareSync } from 'bcrypt-ts-edge';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const config = {
  pages: {
    signIn: '/sign-in',
    error: '/sign-in',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      credentials: {
        email: { type: 'email' },
        password: { type: 'password' },
      },
      async authorize(credentials) {
        if (credentials == null) return null;

        //find user
        const user = await prisma.user.findFirst({
          where: {
            email: credentials.email as string,
          },
        });

        //verify match
        if (user && user.password) {
          const isMatch = compareSync(
            credentials.password as string,
            user.password,
          );

          if (isMatch) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            };
          }
        }

        //if user doesnt exist or password mismatched
        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session, user, trigger, token }: any) {
      session.user.id = token.sub;
      session.user.role = token.role;
      session.user.name = token.name;
      //if there is an update, set the userName
      if (trigger == 'update') {
        session.user.name = user.name;
      }

      return session;
    },
    async jwt({ token, user, trigger, session }: any) {
      //Assign user fields to the jtw

      if (user) {
        token.role = user.role;

        //If user name is empty, use email
        if (user.name === 'NO_NAME') {
          token.name = user.email!.split('@')[0];

          await prisma.user.update({
            where: { id: user.id },
            data: { name: token.name },
          });
        }
      }
      return token;
    },
    authorized({ request, auth }: any) {
      //Check for session cart cookie

      if (!request.cookies.get('sessionCartId')) {
        //Create the cookie

        const sessionCartId = crypto.randomUUID();
        // clone req headers to then add the new cookie
        const newRequestHeaders = new Headers(request.headers);

        const response = NextResponse.next({
          request: { headers: newRequestHeaders },
        });
        response.cookies.set('sessionCartId', sessionCartId);
      } else {
        return true;
      }
    },
  },
} satisfies NextAuthConfig; // added that to make sure the object matches with nextauthConfig

export const { handlers, auth, signIn, signOut } = NextAuth(config);
