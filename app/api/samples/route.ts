import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { verify, JwtPayload } from 'jsonwebtoken';

import { connectToDB } from '@/lib/utils/mongoose';
import User from '@/lib/models/user.model';
import { COOKIE_NAME, PER_PAGE } from '@/constants';
import Sample from '@/lib/models/sample.model';
import { transporter } from '@/config/mailer';

export async function GET(request: Request) {
  const url = new URL(request.url!);
  
  const page = url.searchParams.get('page');
  const perPage = PER_PAGE;

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

    const skipAmount = (parseInt(page!) - 1) * perPage;
    const samplesRequested = parseInt(page!) * perPage;

    const user = await User
      .findById(userId)
      .select('-password');

    if (!user) {
      return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
    }

    //if user is secretary or admin search all samples
    if (user.role !== 'researcher') {
      const totalSamplesCount = await Sample.countDocuments({});

      // if already sent all samples, returns null
      if (totalSamplesCount <= samplesRequested && totalSamplesCount < 0) {
        return NextResponse.json({ user: null, hasMore: false }, { status: 200 });
      }

      const samples = await Sample
        .find({})
        .sort({ createdAt: -1 })
        .limit(perPage)
        .skip(skipAmount)
        .populate({
          path: 'researcher',
          model: User,
          select: '-password',
        });

      user.samples = samples;

      if (user.samples.length < samplesRequested) {
        return NextResponse.json({ user: user, hasMore: false, samplesLength: totalSamplesCount }, { status: 200 });
      }
  
      return NextResponse.json({ user: user, hasMore: true, samplesLength: totalSamplesCount }, { status: 200 });
    }

    //if user is researcher only search assigned samples
    const totalSamplesCount = await Sample.countDocuments({ researcher: userId });

    // if already sent all samples, returns null
    if (totalSamplesCount <= samplesRequested && totalSamplesCount < 0) {
      return NextResponse.json({ user: null, hasMore: false }, { status: 200 });
    }

    const samples = await Sample.find({ researcher: userId })
      .sort({ createdAt: -1 })
      .limit(perPage)
      .skip(skipAmount)
      .populate({
        path: 'researcher',
        model: User,
        select: '-password',
      });

      user.samples = samples;

    if (user.samples.length < samplesRequested) {
      return NextResponse.json({ user: user, hasMore: false, samplesLength: totalSamplesCount }, { status: 200 });
    }

    return NextResponse.json({ user: user, hasMore: true, samplesLength: totalSamplesCount }, { status: 200 });

  } catch (error: any) {
    console.log('GET - /api/samples:', error.message)
    return NextResponse.json({ message: 'Algo salió mal' }, { status: 500 });
  }
};

export async function PUT(request: Request) {
  const body = await request.json();
  
  const { observations, inclusion, thin, semithin, grid, sampleId } = body;

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
      observations,
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
      from: `"Muestra actualizada" <${mailer}>`,
      to: sample.researcher.email,
      subject: 'Muestra actualizada',
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
    console.log('PUT - /api/samples:', error.message)
    return NextResponse.json({ message: 'Algo salió mal' }, { status: 500 });
  }
};

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
      $inc: { samplesCount: 1 },
      $push: { samples: sample._id },
    })
    
    const mailer = process.env.MAILER;
    const createSampleMail = process.env.CREATE_SAMPLE_MAIL || `<div>
      <h1>
        Muestras de Laboratorio
      </h1>
      <p>
        Su muestra ${sampleType} ha sido cargada correctamente.
      </p>
      <p>
        Código de Muestra: ${code}
      </p>
      <p>
        Observaciones: ${observations}
      </p>
    </div>
  `;

    await transporter.sendMail({
      from: `"Muestra Agregada" <${mailer}>`,
      to: updatedResearcher.email,
      subject: 'Muestra agregada',
      html: createSampleMail,
    })

    return NextResponse.json({ message: 'Muestra creada' }, { status: 200 })

  } catch (error: any) {
    console.log('POST - /api/samples:', error.message)
    return NextResponse.json({ message: 'Algo salió mal' }, { status: 500 })
  }
};