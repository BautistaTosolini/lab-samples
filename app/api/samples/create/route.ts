import { sign } from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import { serialize } from 'cookie';

import { connectToDB } from '@/lib/mongoose';
import User from '@/lib/models/user.model';
import { COOKIE_NAME, MAX_AGE } from '@/constants';
import Sample from '@/lib/models/sample.model';

export async function POST(request: Request) {
  const body = await request.json();

  const { author,
    code,
    sampleType,
    observations,
    inclusion,
    semithin,
    thin,
    grid, } = body;

  try {
    connectToDB();

    const sample = await Sample.create({
      author,
      code,
      sampleType,
      observations,
      inclusion,
      semithin,
      thin,
      grid,
    })

    await User.findByIdAndUpdate(author, {
      $push: { samples: sample._id }
    })
    
    const response = { message: 'Muestra creada' }

    return new Response(JSON.stringify(response));

  } catch (error: any) {
    console.log('POST_CREATE:', error.message)
    return NextResponse.json({ message: 'Algo salió mal' }, { status: 500 })
  }
};