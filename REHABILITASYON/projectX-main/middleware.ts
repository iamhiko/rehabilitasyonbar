import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const authToken = request.cookies.get('auth-token')
    const { pathname } = request.nextUrl

    // Admin sayfaları için kontrol
    if (pathname.startsWith('/admin')) {
        if (!authToken) {
            const response = NextResponse.redirect(new URL('/login', request.url))
            response.cookies.delete('auth-token')
            return response
        }
        return NextResponse.next()
    }

    // Login sayfası için kontrol
    if (pathname === '/login') {
        if (authToken) {
            return NextResponse.redirect(new URL('/admin', request.url))
        }
        return NextResponse.next()
    }

    return NextResponse.next()
}

// Configure which routes to run the middleware on
export const config = {
    matcher: ['/admin/:path*', '/login']
} 