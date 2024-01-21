import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { generateToken, saveUser } from '@/dbConfig/db';
import User from '@/models/user';

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { username, password } = reqBody;

    // Check if the username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return NextResponse.json({ msg: 'Username already exists' }, { status: 400 });
    }

    // Save the new user
    await saveUser(username, password);

    // Generate JWT token
    const token = generateToken({ username });

    return NextResponse.json({ msg: 'Signup successful', token });
  } catch (error) {
    return NextResponse.json({ msg: 'Issue happened' }, { status: 500 });
  }
}
