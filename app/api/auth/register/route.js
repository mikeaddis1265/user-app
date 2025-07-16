import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma'
import bcrypt from 'bcrypt';
import { registerSchema, validate } from '../../../../utils/validation';
import { sendErrorResponse } from '../../../../utils/apiResponse';
import { send } from 'process';

export async function POST(req) {
  try {
    const body  = await req.json();

    // Validate the request body using zod
    const {name , email, password} = validate(registerSchema, body);
    

    // if (!name || !email || !password) {
    // return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    // }


    //check for existing user
   const existingUser = await prisma.users.findUnique({ where: { email } });
    if (existingUser) {
      return sendErrorResponse('Email already exists', 409);
    }


    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.users.create({
      data: { name, email, password: hashedPassword },
    });


    return NextResponse.json(
      { message: 'User registered', user: { id: user.id, name: user.name, email: user.email } },
      { status: 201 }
    );
  }catch (error) {
    console.error('Registration error:', error);
    if (error.code === 'P2002') {
      return sendErrorResponse('Email already exists', 409);
    }
    return sendErrorResponse(error.message || 'Registration failed', 400);
  }
}