import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { verify, JwtPayload } from 'jsonwebtoken';

import { connectToDB } from '@/lib/utils/mongoose';
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

    const user = await User
      .findById(userId)
      .select('-password');

    const sample = await Sample.findById(sampleId)
      .populate({
        path: 'researcher',
        model: User,
        select: '-password'
      });

    if (user) {
      return NextResponse.json({ user, sample }, { status: 200 });
    } else {
      return NextResponse.json({ message: 'Algo salió mal' }, { status: 500 });
    }

  } catch (error: any) {
    console.log('GET - /api/samples/[id]:', error.message)
    return NextResponse.json({ message: 'Algo salió mal' }, { status: 500 });
  }
};

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
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

    const user = await User
      .findById(userId)
      .select('-password');

    if (!user || user.role !== 'admin') {
      return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
    }

    const researcher = await User.findOne({ samples: sampleId });

    if (!researcher) {
      return NextResponse.json({ message: 'No se encontró el investigador con esa muestra' }, { status: 404 });
    }

    researcher.samples = researcher.samples.filter((id: number) => id.toString() !== sampleId);
    await researcher.save();

    await Sample.findByIdAndDelete(sampleId);

    return NextResponse.json({ message: 'Muestra eliminada' }, { status: 200 });

  } catch (error: any) {
    console.log('DELETE - /api/samples/[id]:', error.message)
    return NextResponse.json({ message: 'Algo salió mal' }, { status: 500 });
  }
}