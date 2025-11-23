import { NextRequest, NextResponse } from 'next/server';

// Lightweight middleware - only handles session cart cookie
// Authentication is handled at the page/route level using auth() from server components
export async function middleware(request: NextRequest) {
  // Handle session cart cookie logic (no heavy dependencies)
  if (!request.cookies.get('sessionCartId')) {
    const sessionCartId = crypto.randomUUID();
    const response = NextResponse.next();
    response.cookies.set('sessionCartId', sessionCartId);
    return response;
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
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)'
  ]
};
