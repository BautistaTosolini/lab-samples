import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { verify, JwtPayload } from 'jsonwebtoken';

import { connectToDB } from '@/lib/mongoose';
import User from '@/lib/models/user.model';
import { COOKIE_NAME } from '@/constants';
import Sample from '@/lib/models/sample.model';

export async function POST(request: Request) {
  const body = await request.json();

  const { searchParam, currentPage } = body;

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
    
    if (!user) {
      return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
    }
  
    if (searchParam.length < 1) {
      const samples = await Sample.find({
        researcher: user._id,
        options: {
          sort: { createdAt: -1 },
        },
      })
      .populate({
        path: 'researcher',
        model: User,
      });

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
    });

    return NextResponse.json({ samples }, { status: 200 });

  } catch (error: any) {
    console.log('GET_SAMPLES:', error.message)
    return NextResponse.json({ message: 'Algo salió mal' }, { status: 500 });
  }
};