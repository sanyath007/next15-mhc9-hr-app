import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        user: {
            role?: string; // Or your specific role type, e.g., 'admin' | 'user'
        } & DefaultSession["user"];
    }

    /**
     * The `User` type is used in the `session` and `jwt` callbacks, and in the `user` property of the `Session` object.
     */
    interface User {
        role?: string; // Or your specific role type
    }
}

// If you are also using the JWT callback and want to include role in the token
import { JWT } from "next-auth/jwt";

declare module "next-auth/jwt" {
    /**
     * Returned by the `jwt` callback and `getToken`, when using JWT sessions
     */
    interface JWT {
        role?: string; // Or your specific role type
    }
}