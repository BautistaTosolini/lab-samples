import { NextRequest, NextResponse } from 'next/server';
import { JwtPayload, sign, verify } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import { connectToDB } from '@/lib/utils/mongoose';
import User from '@/lib/models/user.model';
import { transporter } from '@/config/mailer';
import { cookies } from 'next/headers';
import { COOKIE_NAME } from '@/constants';


export async function POST(request: NextRequest) {
  const body = await request.json();

  const { email } = body;

  const secret = process.env.JWT_SECRET || '';

  try {
    connectToDB();

    const user = await User.findOne({ email })

    if (!user) {
      return NextResponse.json({ message: 'El E-Mail no es válido' }, { status: 404 });
    }

    const MAX_AGE = 3600 // 1 hour

    const token = sign({ userId: user._id }, secret, { expiresIn: MAX_AGE })

    user.recoveryToken = token;

    await user.save();

    const mailer = process.env.MAILER;
    const url = process.env.BASE_URL;
    const recoverPasswordMail = process.env.RECOVER_PASSWORD_MAIL || `<div>
    <h1>
      Muestras de Laboratorio
    </h1>
    <p>
      Se ha solicitado un reestablecimiento de contraseña, haga <a href=${url}/recover/${token}>click aquí</a> para continuar.
    </p>
    <p>
      Si usted no solicitó este email, ignore las instrucciones.
    </p>
  </div>` 

  console.log(recoverPasswordMail)

    await transporter.sendMail({
      from: `"Recuperación de Cuenta" <${mailer}>`,
      to: user.email,
      subject: 'Recuperación de Cuenta',
      html: recoverPasswordMail,
    })

    return NextResponse.json({ message: 'El link de recuperación ha sido enviado' }, { status: 200 });

  } catch (error: any) {
    console.log('POST - /api/auth/recover:', error.message)
    return NextResponse.json({ message: 'Algo salió mal' }, { status: 500 });
  }
};

export async function PUT(request: NextRequest) {
  const body = await request.json();

  const { password } = body;

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

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await User.findByIdAndUpdate(userId, { password: hashedPassword });

    return NextResponse.json({ message: 'Contraseña reestablecida' }, { status: 200 });

  } catch (error: any) {
    console.log('PUT - /api/auth/recover:', error.message);
    return NextResponse.json({ message: 'Algo salió mal' }, { status: 500 });
  }
};