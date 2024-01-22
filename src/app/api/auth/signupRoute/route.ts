// signupRoute.ts
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { saveUser } from '@/dbConfig/db';
import User from '@/models/user';

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { username, password } = reqBody;

    // Check if the username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return NextResponse.json({ error: 'Username already exists' }, { status: 400 });
    }

    // Save the new user
    const hashedPassword = await bcrypt.hash(password, 10);
    await saveUser(username, hashedPassword);

    return NextResponse.json({ msg: 'Signup successful' });
  } catch (error) {
    console.error('Error signing up:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}