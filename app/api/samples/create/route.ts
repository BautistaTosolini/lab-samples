import { JwtPayload, verify } from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import { connectToDB } from '@/lib/utils/mongoose';
import User from '@/lib/models/user.model';
import { COOKIE_NAME } from '@/constants';
import Sample from '@/lib/models/sample.model';
import { transporter } from '@/config/mailer';

export async function POST(request: Request) {
  const body = await request.json();

  const cookieStore = cookies();

  const token = cookieStore.get(COOKIE_NAME);

  if (!token) {
    return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
  }

  const { value } = token;

  const secret = process.env.JWT_SECRET || '';

  const { researcher,
    code,
    sampleType,
    observations,
    inclusion,
    semithin,
    thin,
    grid, } = body;

  try {
    const { userId } = verify(value, secret) as JwtPayload;

    const user = await User.findById(userId);

    if (!user || user.role === 'researcher') {
      return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
    }

    connectToDB();

    const sample = await Sample.create({
      researcher,
      code,
      sampleType,
      observations,
      inclusion,
      semithin,
      thin,
      grid,
    })

    const updatedResearcher = await User.findByIdAndUpdate(researcher, {
      $push: { samples: sample._id }
    })
    
    const mailer = process.env.MAILER;

    await transporter.sendMail({
      from: `"Muestra Agregada" <${mailer}>`,
      to: updatedResearcher.email,
      subject: 'Muestra agregada',
      html: `
        <div>
          <h1>
            Muestras de Laboratorio
          </h1>
          <p>
            Su muestra ${sampleType} ha sido cargada correctamente.
          </p>
          <p>
            Código de Muestra: ${code}
          </p>
        </div>
      `
    })

    return NextResponse.json({ message: 'Muestra creada' }, { status: 200 })

  } catch (error: any) {
    console.log('POST - /api/samples/create:', error.message)
    return NextResponse.json({ message: 'Algo salió mal' }, { status: 500 })
  }
};