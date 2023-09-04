import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { COOKIE_NAME } from '@/constants';
import { serialize } from 'cookie';

export async function GET() {
  const cookieStore = cookies();

  let token = cookieStore.get(COOKIE_NAME);

  if (!token) {
    return NextResponse.json({ message: 'Sesión no iniciada' }, { status: 401 });
  }

  const serialized = serialize(COOKIE_NAME, '', {
    httpOnly: process.env.NODE_ENV === 'production',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 0,
    path: '/',
  });

  const response = { message: 'Sesión cerrada' };
  
  return new Response(JSON.stringify(response), { status: 200, headers: { 'Set-Cookie': serialized } });

};