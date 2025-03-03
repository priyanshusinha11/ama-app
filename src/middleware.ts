import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
export { default } from 'next-auth/middleware';

export const config = {
    matcher: ['/dashboard/:path*', '/sign-in', '/sign-up', '/'],
};

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request });
    const { pathname } = request.nextUrl;

    // Auth routes - if logged in, redirect to dashboard
    if (token && (pathname === '/sign-in' || pathname === '/sign-up')) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Protected routes - if not logged in, redirect to sign-in
    if (!token && pathname.startsWith('/dashboard')) {
        const signInUrl = new URL('/sign-in', request.url);
        signInUrl.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(signInUrl);
    }

    return NextResponse.next();
}
