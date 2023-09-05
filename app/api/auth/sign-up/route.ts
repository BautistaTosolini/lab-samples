import { sign } from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import { serialize } from 'cookie';

import { connectToDB } from '@/lib/mongoose';
import User from '@/lib/models/user.model';
import { COOKIE_NAME, MAX_AGE } from '@/constants';

export async function POST(request: Request) {
  const body = await request.json();

  const { name, email, password } = body;

  try {
    connectToDB();
    
    const isEmailTaken = await User.findOne({ email });

    if (isEmailTaken) {
      return NextResponse.json({ message: 'El E-Mail ya fue tomado' }, { status: 400 });
    }

    const user = await User.create({
      name,
      email,
      password,
    })
    
    if (!user) {
      return NextResponse.json({ message: 'Algo salió mal' }, { status: 500 })
    }

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

  } catch (error: any) {
    console.log('POST_SIGN-UP:', error.message)
    return NextResponse.json({ message: 'Algo salió mal' }, { status: 500 })
  }
};