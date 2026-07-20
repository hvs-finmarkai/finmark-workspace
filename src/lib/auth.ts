import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import prisma from './prisma';
import bcrypt from 'bcryptjs';

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        if (!email.endsWith('@finmark.ai')) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user || !user.passwordHash) {
          return null;
        }

        const isValid = bcrypt.compareSync(password, user.passwordHash);

        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  callbacks: {
    async signIn({ user, account }) {
      const email = user.email;

      if (!email || !email.endsWith('@finmark.ai')) {
        return false;
      }

      if (account?.provider === 'google') {
        const existingUser = await prisma.user.findUnique({
          where: { email },
        });

        if (!existingUser) {
          return false;
        }

        if (!existingUser.googleEnabled) {
          await prisma.user.update({
            where: { email },
            data: { googleEnabled: true },
          });
        }

        await prisma.activityLog.create({
          data: {
            userId: existingUser.id,
            action: 'LOGIN',
            details: 'Logged in via Google',
          },
        });

        return true;
      }

      if (user.id) {
        await prisma.activityLog.create({
          data: {
            userId: user.id,
            action: 'LOGIN',
            details: 'Logged in via password',
          },
        });
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;
      }

      if (token.email && !token.role) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email },
        });

        if (dbUser) {
          token.role = dbUser.role;
          token.id = dbUser.id;
        }
      }

      // Keep token minimal to avoid header size issues
      return {
        id: token.id,
        email: token.email,
        name: token.name,
        role: token.role,
        sub: token.sub,
        iat: token.iat,
        exp: token.exp,
        jti: token.jti,
      };
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
      }

      return session;
    },
  },
});
