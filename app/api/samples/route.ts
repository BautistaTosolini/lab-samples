import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { verify, JwtPayload } from 'jsonwebtoken';

import { connectToDB } from '@/lib/mongoose';
import User from '@/lib/models/user.model';
import { COOKIE_NAME, PER_PAGE } from '@/constants';
import Sample from '@/lib/models/sample.model';

export async function POST(request: Request) {
  const body = await request.json();
  
  const { currentPage } = body;
  const perPage = PER_PAGE;

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

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    //if user is secretary or admin search all samples
    if (user.role !== 'researcher') {
      const totalSamplesCount = await Sample.countDocuments({});

      // if already sent all samples, returns null
      if (totalSamplesCount <= samplesRequested && totalSamplesCount < 0) {
        return NextResponse.json({ user: null, hasMore: false }, { status: 200 });
      }

      const samples = await Sample
        .find({})
        .sort({ createdAt: -1 })
        .limit(perPage)
        .skip(skipAmount)
        .populate({
          path: 'researcher',
          model: User,
        });

      user.samples = samples;

      if (user.samples.length < samplesRequested) {
        return NextResponse.json({ user: user, hasMore: false, samplesLength: totalSamplesCount }, { status: 200 });
      }
  
      return NextResponse.json({ user: user, hasMore: true, samplesLength: totalSamplesCount }, { status: 200 });
    }

    //if user is researcher only search assigned samples
    const totalSamplesCount = await Sample.countDocuments({ researcher: userId });

    // if already sent all samples, returns null
    if (totalSamplesCount <= samplesRequested && totalSamplesCount < 0) {
      return NextResponse.json({ user: null, hasMore: false }, { status: 200 });
    }

    const samples = await Sample.find({ researcher: userId })
      .sort({ createdAt: -1 })
      .limit(perPage)
      .skip(skipAmount)
      .populate({
        path: 'researcher',
        model: User,
      });

      user.samples = samples;

    if (user.samples.length < samplesRequested) {
      return NextResponse.json({ user: user, hasMore: false, samplesLength: totalSamplesCount }, { status: 200 });
    }

    return NextResponse.json({ user: user, hasMore: true, samplesLength: totalSamplesCount }, { status: 200 });

  } catch (error: any) {
    console.log('GET_SAMPLES:', error.message)
    return NextResponse.json({ message: 'Algo salió mal' }, { status: 500 });
  }
};