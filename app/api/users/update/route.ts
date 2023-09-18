import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { verify, JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import { connectToDB } from '@/lib/utils/mongoose';
import User from '@/lib/models/user.model';
import { COOKIE_NAME } from '@/constants';

export async function POST(request: NextRequest) {
  const body = await request.json();

 const { email, password } = body;

  const cookieStore = cookies();

  const token = cookieStore.get(COOKIE_NAME);

  if (!token) {
    return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
  }

  const { value } = token;

  const secret = process.env.JWT_SECRET || '';

  try {
    const { userId } = verify(value, secret) as JwtPayload;

    connectToDB();

    const user = await User.findById(userId)

    if (!user) {
      return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
    }

    if (email?.length > 0) {
      user.email = email;
    }

    if (password?.length > 0) {
      user.password = password;
    }

    await user.save();

    return NextResponse.json({ user }, { status: 200 });

  } catch (error: any) {
    console.log('POST - /api/users/update:', error.message)
    return NextResponse.json({ message: 'Algo salió mal' }, { status: 500 });
  }
};