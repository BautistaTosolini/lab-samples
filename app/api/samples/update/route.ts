import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { verify, JwtPayload } from 'jsonwebtoken';

import { connectToDB } from '@/lib/mongoose';
import User from '@/lib/models/user.model';
import { COOKIE_NAME } from '@/constants';
import Sample from '@/lib/models/sample.model';

export async function POST(request: Request) {
  const body = await request.json();
  
  const { inclusion, thin, semithin, grid, sampleId } = body;

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

    const updatedSample = await Sample.findByIdAndUpdate(sampleId, {
      inclusion,
      thin,
      semithin,
      grid
    })

    return NextResponse.json({ message: 'Muestra actualizada' }, { status: 200 });

  } catch (error: any) {
    console.log('GET_SAMPLES:', error.message)
    return NextResponse.json({ message: 'Algo salió mal' }, { status: 500 });
  }
};