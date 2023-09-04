import { sign } from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import { serialize } from 'cookie';
import bcrypt from 'bcryptjs';

import { connectToDB } from '@/lib/mongoose';
import User from '@/lib/models/user.model';
import { COOKIE_NAME, MAX_AGE } from '@/constants';

export async function POST(request: Request) {
  const body = await request.json();

  const { email, password } = body;

  try {
    connectToDB();
    
    const user = await User.findOne({ email });
    
    if (!user) {
      return NextResponse.json({ message: 'E-Mail o contraseña inválidos' }, { status: 401 })
    }

    if (await bcrypt.compare(password, user.password)) {
      const secret = process.env.JWT_SECRET || '';
      
      const token = sign({ userId: user._id }, secret, { expiresIn: MAX_AGE })
  
      const serialized = serialize(COOKIE_NAME, token, {
        httpOnly: process.env.NODE_ENV === 'production',
        secure: process.env.NODE_ENV === 'production',
        maxAge: MAX_AGE,
        path: '/',
      });

      const response = { message: 'Autenticado' };
  
      return new Response(JSON.stringify(response), { status: 200, headers: { 'Set-Cookie': serialized } });
    } else {
      return NextResponse.json({ message: 'E-Mail o contraseña inválidos' }, { status: 401 })
    }

  } catch (error: any) {
    console.log('POST_SIGN-UP:', error.message)
    return NextResponse.json({ message: 'Algo salió mal' }, { status: 500 })
  }
};