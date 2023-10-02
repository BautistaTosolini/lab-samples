import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { verify, JwtPayload } from 'jsonwebtoken';

import { connectToDB } from '@/lib/utils/mongoose';
import User from '@/lib/models/user.model';
import { COOKIE_NAME } from '@/constants';
import Sample from '@/lib/models/sample.model';

export async function GET() {
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

    const user = await User.findById(userId);

    if (!user || user.role === 'researcher') {
      return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
    }

    const users = await User.find({ role: 'researcher' });

    if (!users) {
      return NextResponse.json({ message: 'Algo salió mal' }, { status: 500 });
    }

    return NextResponse.json({ users: users }, { status: 200 });

  } catch (error: any) {
    console.log('GET - /api/users:', error.message)
    return NextResponse.json({ message: 'Algo salió mal' }, { status: 500 });
  }
};

export async function PUT(request: NextRequest) {
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
    console.log('PUT - /api/users:', error.message)
    return NextResponse.json({ message: 'Algo salió mal' }, { status: 500 });
  }
};
