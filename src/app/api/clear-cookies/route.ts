import { NextResponse } from 'next/server';

export async function GET() {
  const response = NextResponse.redirect(new URL('/login', 'https://finmarkworkflow.vercel.app'));
  
  // Clear all possible NextAuth cookies
  const cookieNames = [
    '__Secure-authjs.session-token',
    '__Secure-authjs.callback-url',
    '__Secure-authjs.csrf-token',
    '__Host-authjs.csrf-token',
    'authjs.session-token',
    'authjs.callback-url', 
    'authjs.csrf-token',
    '__Secure-next-auth.session-token',
    '__Secure-next-auth.callback-url',
    '__Secure-next-auth.csrf-token',
    '__Host-next-auth.csrf-token',
    'next-auth.session-token',
    'next-auth.callback-url',
    'next-auth.csrf-token',
  ];

  cookieNames.forEach(name => {
    response.cookies.set(name, '', { 
      expires: new Date(0),
      path: '/',
      secure: true,
      httpOnly: true,
    });
  });

  return response;
}
