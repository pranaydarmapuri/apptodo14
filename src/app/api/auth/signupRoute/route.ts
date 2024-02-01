import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { connect, saveUser } from '@/dbConfig/db';
import User from '@/models/user';
import { generateToken } from '@/dbConfig/db';

connect();

export async function POST(request: NextRequest) {
  try {
    
    const reqBody = await request.json();
    console.log('Request Body:', reqBody);
    const { username, password } = reqBody;

    const existingUser = await User.findOne({ username }).maxTimeMS(30000);
    if (existingUser) {
      return NextResponse.json({ error: 'Username already exists' }, { status: 400 });
    }

    const user=await saveUser(username, password);


    if (!user) {
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }

    const token = generateToken({ username: user.username, userId: user._id });

    return NextResponse.json({ msg: 'Signup successful', token }, { status: 200 });
  } catch (error) {
    console.error('Error signing up:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
