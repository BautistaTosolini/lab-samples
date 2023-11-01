import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { verify, JwtPayload } from 'jsonwebtoken';

import { connectToDB } from '@/lib/utils/mongoose';
import User from '@/lib/models/user.model';
import { COOKIE_NAME, PER_PAGE } from '@/constants';
import Sample from '@/lib/models/sample.model';
import { verifyMonthDifference } from '@/lib/utils/verifyMonthDifference';

export async function GET(request: Request) {
  const url = new URL(request.url!);
  
  const page = url.searchParams.get('page');
  const searchParam = url.searchParams.get('searchParam');
  const perPage = PER_PAGE;

  if (!page || !searchParam) {
    return NextResponse.json({ message: 'Parámetro inválido' }, { status: 400 });
  }

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
    
    const skipAmount = (parseInt(page) - 1) * perPage;
    const samplesRequested = parseInt(page) * perPage;

    const user = await User
      .findById(userId)
      .select('-password');
    
    if (!user) {
      return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
    }

    //if user is secretary or admin search all samples
    if (user.role !== 'researcher') {
      const totalSamplesCount = await Sample.countDocuments({ code: { $regex: new RegExp(searchParam, 'i') } });

      // if already sent all samples, returns null
      if (totalSamplesCount < samplesRequested && totalSamplesCount < 0) {
        return NextResponse.json({ samples: null }, { status: 200 });
      }

      const samples = await Sample
        .find({ code: { $regex: new RegExp(searchParam, 'i') } })
        .sort({ createdAt: -1 })
        .limit(perPage)
        // .skip(skipAmount)
        .populate({
           path: 'researcher',
           model: User,
           select: '-password',
        });

      user.samples = samples;

      return NextResponse.json({ samples, hasMore: true }, { status: 200 });
    }


    
    //if user is researcher only search assigned samples
    const totalSamplesCount = await Sample.countDocuments({
      $and: [
        { researcher: userId },
        { code: { $regex: new RegExp(searchParam, 'i') } },
      ],
    });

    // if already sent all samples, returns null
    if (totalSamplesCount < samplesRequested && totalSamplesCount < 0) {
      return NextResponse.json({ samples: null, hasMore: false }, { status: 200 });
    }
  
    if (searchParam.length < 1) {
      const samples = await Sample.find({
        researcher: user._id,
        options: {
          sort: { createdAt: -1 },
        },
      })
      .limit(perPage)
      .skip(skipAmount)
      .populate({
        path: 'researcher',
        model: User,
        select: '-password',
      })
      .sort({ createdAt: -1 });

      return NextResponse.json({ samples }, { status: 200 });
    }

    const samples = await Sample
    .find({
      code: { $regex: new RegExp(searchParam, 'i') },
      researcher: user._id,
    })
    .sort({
      createdAt: -1,
    })
    .populate({
      path: 'researcher',
      model: User,
      select: '-password',
    })
    .limit(perPage)
    .skip(skipAmount);

    if (samples.length < samplesRequested) {
      return NextResponse.json({ samples: samples, hasMore: false, samplesLength: totalSamplesCount }, { status: 200 });
    }

    return NextResponse.json({ samples: samples, hasMore: true, samplesLength: totalSamplesCount }, { status: 200 });

  } catch (error: any) {
    console.log('GET - /api/samples/search:', error.message)
    return NextResponse.json({ message: 'Algo salió mal' }, { status: 500 });
  }
};

export async function POST(request: Request) {
  const body = await request.json();

  const cookieStore = cookies();

  const token = cookieStore.get(COOKIE_NAME);

  if (!token) {
    return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
  }

  const { value } = token;

  const secret = process.env.JWT_SECRET || '';

  const {
    initialDate,
    finalDate,
  } = body;

  try {
    const { userId } = verify(value, secret) as JwtPayload;

    const user = await User.findById(userId);

    if (!user || user.role === 'researcher') {
      return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
    }

    if (verifyMonthDifference(initialDate, finalDate)) {
      return NextResponse.json({ message: 'No puede haber más de un mes de diferencia' }, { status: 400 });
    }

    connectToDB();

    const samples = await Sample.find({
      createdAt: {
        $gte: new Date(initialDate),
        $lte: new Date(finalDate),
      },
    })
    .populate({
      path: 'researcher',
    })
    .sort({ createdAt: -1 });
  
    return NextResponse.json({ samples }, { status: 200 })

  } catch (error: any) {
    console.log('POST - /api/samples/search:', error.message)
    return NextResponse.json({ message: 'Algo salió mal' }, { status: 500 })
  }
};