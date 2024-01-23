// signupRoute.ts
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt'
import { connect, saveUser } from '@/dbConfig/db';
import User from '@/models/user';

connect()

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { username, password } = reqBody;

    // Check if the username already exists
    const existingUser = await User.findOne({ username }).maxTimeMS(30000);
    if (existingUser) {
      return NextResponse.json({ error: 'Username already exists' }, { status: 400 });
    }

    // No need to hash it again so i am not hashing
    await saveUser(username, password);

    return NextResponse.json({ msg: 'Signup successful' });
  } catch (error) {
    console.error('Error signing up:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
