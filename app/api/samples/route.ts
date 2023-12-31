import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { verify, JwtPayload } from 'jsonwebtoken';

import { connectToDB } from '@/lib/utils/mongoose';
import User from '@/lib/models/user.model';
import { COOKIE_NAME, PER_PAGE } from '@/constants';
import Sample from '@/lib/models/sample.model';
import { transporter } from '@/config/mailer';
import Service from '@/lib/models/service.model';

export async function GET(request: Request) {
  const url = new URL(request.url!);
  
  const page = url.searchParams.get('page');
  const type = url.searchParams.get('type');
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
      const totalSamplesCount = await Sample.countDocuments({ serviceType: type });

      // if already sent all samples, returns null
      if (totalSamplesCount <= samplesRequested && totalSamplesCount < 0) {
        return NextResponse.json({ user: null, hasMore: false }, { status: 200 });
      }

      const samples = await Sample
        .find({
          serviceType: type
        })
        .sort({
          createdAt: -1
        })
        .limit(perPage)
        .skip(skipAmount)
        .populate({
          path: 'researcher',
          model: User,
          select: '-password',
        });

      user.samples = samples;

      if (totalSamplesCount < samplesRequested) {
        return NextResponse.json({ user: user, hasMore: false, samplesLength: totalSamplesCount }, { status: 200 });
      }
  
      return NextResponse.json({ user: user, hasMore: true, samplesLength: totalSamplesCount }, { status: 200 });
    }

    //if user is researcher only search assigned samples
    const totalSamplesCount = await Sample.countDocuments({
      $and: [
        { researcher: userId },
        { serviceType: type },
      ],
    });

    // if already sent all samples, returns null
    if (totalSamplesCount <= samplesRequested && totalSamplesCount < 0) {
      return NextResponse.json({ user: null, hasMore: false }, { status: 200 });
    }

    const samples = await Sample
      .find({ 
        researcher: userId,
        serviceType: type,
      })
      .sort({
        createdAt: -1
      })
      .limit(perPage)
      .skip(skipAmount)
      .populate({
        path: 'researcher',
        model: User,
        select: '-password',
      });

      user.samples = samples;

    if (totalSamplesCount < samplesRequested) {
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
  
  const { 
    observations, 
    inclusion, 
    thin, 
    semithin, 
    grid, 
    sampleId,
    staining,
    finished 
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

    connectToDB();

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
    }

    const sample = await Sample.findById(sampleId)
      .populate({
        path: 'researcher',
        model: User,
      });

    let observationsUpdated = false;

    if (sample.observations !== observations) observationsUpdated = true;

    sample.observations = observations;
    sample.inclusion = inclusion;
    sample.thin = thin;
    sample.semithin = semithin;
    sample.grid = grid;
    sample.staining = staining;
    sample.finished = finished;

    await sample.save();

    const mailer = process.env.MAILER;
    const url = process.env.BASE_URL;

    if (finished) {
      await transporter.sendMail({
        from: `"Muestra actualizada" <${mailer}>`,
        to: sample.researcher.email,
        subject: 'Muestra finalizada',
        html: `
          <div>
            <h1>
              Muestras de Laboratorio
            </h1>
            <p>
              Su <a href=${url}/dashboard/${sample._id}>muestra ${sample.sampleType}</a> ha sido finalizada. 
            </p>
            <p>
              Código de Muestra: ${sample.code}
            </p>
            <p>
              ${
                !observations ? 
                  'Sin observaciones' 
                : 
                  `Observaciones: ${observations}`
              }
            </p>
          </div>
        `

      })
    } else if (observationsUpdated) {
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
              Su <a href=${url}/dashboard/${sample._id}>muestra ${sample.sampleType}</a> ha sido actualizada.
            </p>
            <p>
              Código de Muestra: ${sample.code}
            </p>
            <p>
              ${
                !observations ? 
                  'Sin observaciones' 
                : 
                  `Observaciones: ${observations}`
              }
            </p>
          </div>
        `
      })
    }

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

  const { 
    researcher,
    code,
    sampleType,
    observations,
    serviceCode,
   } = body;

  try {
    const { userId } = verify(value, secret) as JwtPayload;

    const user = await User.findById(userId);

    if (!user || user.role === 'researcher') {
      return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
    }

    connectToDB();

    const service = await Service.findOne({ code: serviceCode });

    let sample;

    if (service.type === 'processing') {
      sample = await Sample.create({
        researcher,
        code,
        sampleType,
        observations,
        price: service.price,
        serviceName: service.name,
        serviceType: service.type,
        service: service._id,
        inclusion: false,
        semithin: false,
        thin: false,
        grid: false,
      })
    } else {
      sample = await Sample.create({
        researcher,
        code,
        sampleType,
        observations,
        price: service.price,
        serviceName: service.name,
        serviceType: service.type,
        service: service._id,
        staining: false, 
      })
    }
    
    const updatedResearcher = await User.findByIdAndUpdate(researcher, {
      $inc: { samplesCount: 1 },
      $push: { samples: sample._id },
    })
    
    const mailer = process.env.MAILER;
    const url = process.env.BASE_URL;
    const createSampleMail = `<div>
      <h1>
        Muestras de Laboratorio
      </h1>
      <p>
        Su <a href=${url}/dashboard/${sample._id}>muestra ${sample.sampleType}</a> ha sido cargada correctamente.
      </p>
      <p>
        Código de Muestra: ${code}
      </p>
      <p>
        ${
          !observations ? 
            'Sin observaciones' 
          : 
            `Observaciones: ${observations}`
        }
      </p>
      <p>
        Tipo de servicio: ${sample.serviceName}
      </p>
      <p>
        Costo: $${sample.price}
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