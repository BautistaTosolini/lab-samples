import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { verify, JwtPayload } from 'jsonwebtoken';

import { connectToDB } from '@/lib/mongoose';
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

    const user = await User.findById(userId)
  .populate({
    path: 'samples',
    model: Sample,
    options: {
      sort: { createdAt: -1 },
      limit: 15,
    },
    populate: {
      path: 'researcher',
      model: User,
    },
  });

    if (user) {
      return NextResponse.json({ user }, { status: 200 });
    } else {
      return NextResponse.json({ message: 'Algo salió mal' }, { status: 500 });
    }

  } catch (error: any) {
    console.log('GET_AUTHENTICATE:', error.message)
    return NextResponse.json({ message: 'Algo salió mal' }, { status: 500 });
  }
};