import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import authConfig from '@/auth.config';
import db from '@/lib/db';

const adapter = PrismaAdapter(db);

export const { auth, handlers, signIn, signOut } = NextAuth({
    secret: process.env.AUTH_SECRET,
    adapter,
    session: { strategy: 'jwt' },
    ...authConfig,
});