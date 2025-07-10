import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma'
import bcrypt from 'bcrypt';

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.users.create({
      data: { name, email, password: hashedPassword },
    });

    return NextResponse.json(
      { message: 'User registered', user: { id: user.id, name: user.name, email: user.email } },
      { status: 201 }
    );
  } catch (error) {

    console.error(error);
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}