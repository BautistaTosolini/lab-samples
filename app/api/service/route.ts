import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { verify, JwtPayload } from 'jsonwebtoken';

import { connectToDB } from '@/lib/utils/mongoose';
import User from '@/lib/models/user.model';
import { COOKIE_NAME, PER_PAGE } from '@/constants';
import Sample from '@/lib/models/sample.model';
import { transporter } from '@/config/mailer';
import Service from '@/lib/models/service.model';

export async function POST(request: Request) {
  const cookieStore = cookies();

  const token = cookieStore.get(COOKIE_NAME);

  if (!token) {
    return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
  }

  const { value } = token;

  const secret = process.env.JWT_SECRET || '';

  try {
    const { userId } = verify(value, secret) as JwtPayload;

    const user = await User.findById(userId);

    if (!user || user.role === 'researcher') {
      return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
    }

    connectToDB();
    
    const names = [
      'Procesamiento Completo',
      'Procesamiento Parcial (hasta Semi-Fino)',
      'Tinción Negativa (Nano)',
      'Tinción Negativa (Vesículas)',
      'Tinción Negativa (Bacterias)',
    ]

    for (let i = 0; i < names.length; i++) {
      if (i >= 2) {
        await Service.create({
          code: i,
          name: names[i],
          type: 'staining',
        })
      } else {
        await Service.create({
          code: i,
          name: names[i],
          type: 'processing',
        })
      }
    }

    return NextResponse.json({ message: 'Servicios creados' }, { status: 200 })

  } catch (error: any) {
    console.log('POST - /api/service:', error.message)
    return NextResponse.json({ message: 'Algo salió mal' }, { status: 500 })
  }
};

export async function GET(request: Request) {
  const cookieStore = cookies();

  const token = cookieStore.get(COOKIE_NAME);

  if (!token) {
    return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
  }

  const { value } = token;

  const secret = process.env.JWT_SECRET || '';

  try {
    const { userId } = verify(value, secret) as JwtPayload;

    const user = await User.findById(userId);

    if (!user || user.role === 'researcher') {
      return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
    }

    connectToDB();

    const services = await Service.find();

    if (!services) {
      return NextResponse.json({ message: 'No se encontró ningún servicio' }, { status: 404 });
    }
    
    return NextResponse.json({ services }, { status: 200 })

  } catch (error: any) {
    console.log('GET - /api/service:', error.message)
    return NextResponse.json({ message: 'Algo salió mal' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  const body = await request.json();
  
  const { 
    code,
    price,
  } = body;

  const cookieStore = cookies();

  const token = cookieStore.get(COOKIE_NAME);

  if (!token) {
    return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
  }

  const { value } = token;

  const secret = process.env.JWT_SECRET || '';

  try {
    const { userId } = verify(value, secret) as JwtPayload;

    const user = await User.findById(userId);

    if (!user || user.role === 'researcher') {
      return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
    }

    connectToDB();

    const service = await Service.findOneAndUpdate({ code }, { price });

    return NextResponse.json({ message: 'Muestra actualizada' }, { status: 200 })

  } catch (error: any) {
    console.log('POST - /api/service:', error.message)
    return NextResponse.json({ message: 'Algo salió mal' }, { status: 500 })
  }
}