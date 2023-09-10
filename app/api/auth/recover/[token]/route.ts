import { COOKIE_NAME } from "@/constants";
import User from "@/lib/models/user.model";
import { connectToDB } from "@/lib/utils/mongoose";
import { serialize } from "cookie";
import { JwtPayload, verify } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest, { params }: { params: { token: string } }) {
  const { token } = params;

  try {
    const secret = process.env.JWT_SECRET || '';

    connectToDB();

    const { userId } = verify(token, secret) as JwtPayload;

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 400 });
    }

    if (user.recoveryToken !== token) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 400 });
    }

    const serialized = serialize(COOKIE_NAME, token, {
      httpOnly: process.env.NODE_ENV === 'production',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600,
      path: '/',
    });

    return NextResponse.json({ message: 'Autenticado' }, { status: 200, headers: { 'Set-Cookie': serialized } });

  } catch (error: any) {
    console.log('POST - /api/auth/sign-in:', error.message)
    return NextResponse.json({ message: 'Invalid token' }, { status: 400 });
  }
}