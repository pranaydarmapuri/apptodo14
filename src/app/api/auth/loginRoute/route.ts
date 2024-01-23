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

    console.log('Provided Password:', password);
    console.log('User Password Hash:', user?.passwordHash);

    if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
      console.log('Invalid credentials');
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Generate JWT token
    const token = generateToken({ username: user.username, userId: user._id });

    return NextResponse.json({ msg: 'Login successful', token });
  } catch (error) {
    console.error('Error logging in:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
