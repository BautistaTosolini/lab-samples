import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { verify, JwtPayload } from 'jsonwebtoken';

import { connectToDB } from '@/lib/utils/mongoose';
import User from '@/lib/models/user.model';
import { COOKIE_NAME } from '@/constants';
import { transporter } from '@/config/mailer';
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

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
    }

    await Sample.findByIdAndUpdate(sampleId, {
      inclusion,
      thin,
      semithin,
      grid
    })

    const sample = await Sample.findById(sampleId)
      .populate({
        path: 'researcher',
        model: User,
      });

    const mailer = process.env.MAILER;

    await transporter.sendMail({
      from: `"Muestra Agregada" <${mailer}>`,
      to: sample.researcher.email,
      subject: 'Muestra agregada',
      html: `
        <div>
          <h1>
            Muestras de Laboratorio
          </h1>
          <p>
            Su muestra ${sample.sampleType} ha sido actualizada.
          </p>
        </div>
      `
    })

    return NextResponse.json({ message: 'Muestra actualizada' }, { status: 200 });

  } catch (error: any) {
    console.log('POST - /api/samples/update:', error.message)
    return NextResponse.json({ message: 'Algo salió mal' }, { status: 500 });
  }
};