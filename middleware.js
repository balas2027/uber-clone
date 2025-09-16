// middleware.js
import { NextResponse } from 'next/server';
import { updateSession } from './utils/supabase/middleware';

export async function middleware(request) {
  // Handle Stripe webhook - disable body parsing for raw body access
  if (request.nextUrl.pathname === '/api/webhook/stripe') {
    const response = NextResponse.next();
    response.headers.set('x-middleware-cache', 'no-cache');
    return response;
  }

  // Otherwise, run Supabase session update
  return await updateSession(request);
}

export const config = {
  matcher: [
    // Include Stripe webhook explicitly
    '/api/webhook/stripe',
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
