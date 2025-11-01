import { NextRequest, NextResponse } from 'next/server';
// import { verifyToken } from '@/lib/auth';
import { getToken } from 'next-auth/jwt';

// Define protected routes
const protectedRoutes = [
    '/dashboard',
    '/employee',
    '/product',
    '/users',
];

// Define auth routes (redirect if already authenticated)
const authRoutes = [
    '/login',
    '/register',
    '/forgot-password',
    '/signin',
    // '/check-in',
];

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const user = await getToken({ req, secret: process.env.AUTH_SECRET });

    /** Get token from cookies or Authorization header */
    // const token = req.cookies.get('auth_token')?.value || 
    //                 req.headers.get('authorization')?.replace('Bearer ', '');

    /** Check user is logged in or not */
    // const isAuthenticated = token ? true : false; //verifyToken(token) !== null
    const isAuthenticated = !!user;

    // Check if the current path is a protected route
    const isProtectedRoute = protectedRoutes.some(route => 
        pathname.startsWith(route)
    );

    // Check if the current path is an auth route
    const isAuthRoute = authRoutes.some(route => 
        pathname.startsWith(`${route}`) || pathname.startsWith(route)
    );

    // Redirect unauthenticated users from protected routes
    if (isProtectedRoute && !isAuthenticated) {
        const loginUrl = new URL('/signin', req.url);
        loginUrl.searchParams.set('redirect', pathname);

        return NextResponse.redirect(loginUrl);
    }

    // Redirect authenticated users from auth routes
    if (isAuthRoute && isAuthenticated) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
        * Match all request paths except for the ones starting with:
        * - api (API routes)
        * - _next/static (static files)
        * - _next/image (image optimization files)
        * - favicon.ico (favicon file)
        * - public folder
        */
        '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
    ],
};
