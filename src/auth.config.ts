import GitHub from 'next-auth/providers/github';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import db from '@/lib/db';

export default {
    providers: [
        GitHub,
        Credentials({
            credentials: {
                email: {},
                password: {}
            },
            authorize: async (credentials) => {
                const user = await db.user.findUnique({
                    where: { email: credentials.email as string },
                });

                if (!user) {
                    throw new Error("Invalid credentials.");
                }

                
                const isValidPassword = await bcrypt.compare(credentials.password as string, user.password);
                if (!isValidPassword) {
                    throw new Error("Invalid password.");
                }

                return user;
            },
        }),
    ]
};