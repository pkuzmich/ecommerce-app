import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from './db/prisma';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compareSync } from 'bcrypt-ts-edge';
import type { NextAuthConfig } from 'next-auth';

export const config = {
  pages: {
    signIn: '/signin',
    signOut: '/auth/signout',
    error: '/signin',
    verifyRequest: '/auth/verify-request',
    newUser: '/auth/new-user'
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60 // 24 hours
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      credentials: {
        email: { type: 'email' },
        password: { type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials) {
          throw new Error('Invalid credentials');
        }
        // Find the user in the database by email
        const user = await prisma.user.findFirst({
          where: { email: credentials.email as string }
        });

        if (user && user.password) {
          const isMatch = compareSync(credentials.password as string, user.password);
          if (isMatch) {
            return {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role
            };
          }
        }
        // If user doesn't exist or password doesn't match
        return null;
      }
    })
  ],
  callbacks: {
    async session({ session, user, trigger, token }: any) {
      // Set the user ID from the token
      session.user.id = token.sub;

      // if there is an update, set the user name
      if (trigger === 'update') {
        session.user.name = user.name;
      }

      return session;
    }
  }
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
