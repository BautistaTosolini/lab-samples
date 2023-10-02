import { COOKIE_NAME } from '@/constants';
import Sample from '@/lib/models/sample.model';
import User from '@/lib/models/user.model';
import { connectToDB } from '@/lib/utils/mongoose';
import { verify } from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
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

    const researcher = await User.findById(params.id);

    if (!researcher) {
      return NextResponse.json({ message: 'No se encontró el investigador' }, { status: 404 });
    }

    const sampleIds = researcher.samples;

    await Sample.deleteMany({ _id: { $in: sampleIds } });

    await User.findByIdAndDelete(params.id);

    return NextResponse.json({ message: 'Usuario eliminado' }, { status: 200 });

  } catch (error: any) {
    console.log('DELETE - /api/samples:', error.message)
    return NextResponse.json({ message: 'Algo salió mal' }, { status: 500 });
  }
}