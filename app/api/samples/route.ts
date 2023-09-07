import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { verify, JwtPayload } from 'jsonwebtoken';

import { connectToDB } from '@/lib/mongoose';
import User from '@/lib/models/user.model';
import { COOKIE_NAME } from '@/constants';
import Sample from '@/lib/models/sample.model';

export async function POST(request: Request) {
  const body = await request.json();
  
  const { currentPage } = body;
  const perPage = 15;

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

    const skipAmount = (currentPage - 1) * perPage;
    const samplesRequested = currentPage * perPage;

    const totalSamplesCount = await Sample.countDocuments({
      $or: [
        { author: userId }, 
        { assignedTo: userId },
      ]
    });

    // if already sent all samples, returns null
    if (totalSamplesCount < samplesRequested && totalSamplesCount < 0) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const user = await User.findById(userId)
      .populate({
        path: 'samples',
        model: Sample,
        options: {
          sort: { createdAt: -1 },
          limit: perPage,
          skip: skipAmount,
        },
        populate: {
          path: 'researcher',
          model: User,
        },
      });

    if (user) {
      return NextResponse.json({ user: user }, { status: 200 });
    } else {
      return NextResponse.json({ message: 'Algo salió mal' }, { status: 500 });
    }

  } catch (error: any) {
    console.log('GET_SAMPLES:', error.message)
    return NextResponse.json({ message: 'Algo salió mal' }, { status: 500 });
  }
};