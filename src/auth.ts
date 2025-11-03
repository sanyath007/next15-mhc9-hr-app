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
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.role = user.role // เพิ่ม role เข้าไป
            }

            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string
                session.user.role = token.role
                session.user.image = token.picture // เพิ่มการรับรูปภาพเข้ามา
            }

            return session;
        }
    }
});