import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { verify, JwtPayload } from 'jsonwebtoken';

import { connectToDB } from '@/lib/mongoose';
import User from '@/lib/models/user.model';
import { COOKIE_NAME } from '@/constants';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const cookieStore = cookies();

  const token = cookieStore.get(COOKIE_NAME);

  if (!token) {
    return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
  }

  const { value } = token;

  const secret = process.env.JWT_SECRET || '';

  try {
    const { userId } = verify(value, secret) as JwtPayload;
    const sampleId = params.id;

    connectToDB();

    const assignedUsers = await User.find({
      _id: { $ne: userId },
      samples: { $in: [sampleId] },
      role: 'user',
    });

    const unassignedUsers = await User.find({
      _id: { $ne: userId },
      samples: { $nin: [sampleId] },
      role: 'user',
      options: {
        limit: 25,
      }
    })

    return NextResponse.json({ assignedUsers, unassignedUsers }, { status: 200 });

  } catch (error: any) {
    console.log('GET_SAMPLES:', error.message)
    return NextResponse.json({ message: 'Algo salió mal' }, { status: 500 });
  }
};