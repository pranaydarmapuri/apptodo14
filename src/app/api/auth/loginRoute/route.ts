// src/app/api/auth/loginRoute.ts
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { generateToken } from '@/dbConfig/db';
import User from '@/models/user';

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { username, password } = reqBody;

    // Find user by username
    const user = await User.findOne({ username });

    if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
      return NextResponse.json({ msg: 'Invalid credentials' }, { status: 401 });
    }

    // Generate JWT token
    const token = generateToken({ username: user.username, userId: user._id });

    return NextResponse.json({ msg: 'Login successful', token });
  } catch (error) {
    return NextResponse.json({ msg: 'Issue happened' }, { status: 500 });
  }
}
