import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { verify, JwtPayload } from 'jsonwebtoken';

import { connectToDB } from '@/lib/mongoose';
import User from '@/lib/models/user.model';
import { COOKIE_NAME } from '@/constants';
import Sample from '@/lib/models/sample.model';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const sampleId = params.id

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
    const sample = await Sample.findById(sampleId)
      .populate({
        path: 'researcher',
        model: User,
      });

    if (user) {
      return NextResponse.json({ user, sample }, { status: 200 });
    } else {
      return NextResponse.json({ message: 'Algo salió mal' }, { status: 500 });
    }

  } catch (error: any) {
    console.log('GET_SINGLESAMPLE:', error.message)
    return NextResponse.json({ message: 'Algo salió mal' }, { status: 500 });
  }
};