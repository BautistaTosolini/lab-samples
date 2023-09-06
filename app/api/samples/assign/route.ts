import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { verify, JwtPayload } from 'jsonwebtoken';

import { connectToDB } from '@/lib/mongoose';
import User from '@/lib/models/user.model';
import { COOKIE_NAME } from '@/constants';
import Sample from '@/lib/models/sample.model';

export async function POST(request: Request) {
  const body = await request.json();
  
  const { assignUserId, sampleId } = body;

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

    const user = await User.findById(assignUserId);
    console.log(user)

    if (!user) {
      return NextResponse.json({ message: 'Usuario no encontrado' }, { status: 404 });
    }

    const sample = await Sample.findById(sampleId);

    if (!sample) {
      return NextResponse.json({ message: 'Muestra no encontrada' }, { status: 404 });
    }

    console.log('USERID:', assignUserId)
    console.log('USER SAMPLES:', user.samples)
    console.log('USER:', user)
    const isAssigned = user.samples.includes(sampleId);
    let message = '';

    if (isAssigned) {
      const sampleIndex = user.samples.indexOf(sampleId);
      if (sampleIndex !== -1) {
        user.samples.splice(sampleIndex, 1);
      }

      const assignUserIndex = sample.assignedTo.indexOf(assignUserId);
      if (assignUserIndex !== -1) {
        sample.assignedTo.splice(assignUserIndex, 1);
      }

      message = 'Muestra desasignada';
    } else {
      user.samples.push(sampleId);
      sample.assignedTo.push(assignUserId);
      message = 'Muestra asignada'
    }

    await user.save();
    await sample.save();

    return NextResponse.json({ message }, { status: 200 });

  } catch (error: any) {
    console.log('GET_SAMPLES:', error.message)
    return NextResponse.json({ message: 'Algo salió mal' }, { status: 500 });
  }
};