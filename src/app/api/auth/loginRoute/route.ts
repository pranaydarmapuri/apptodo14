import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { connect, generateToken } from '@/dbConfig/db';
import User from '@/models/user';

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { username, password } = reqBody;

    const user = await User.findOne({ username });

    console.log('Provided Password:', password);
    console.log('User route login route:', user);

    if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
      console.log('Invalid credentials');
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = generateToken({ username: user.username, userId: user._id });

    return NextResponse.json({ msg: 'Login successful', user: user, jwtToken: token }, { status: 200 });
  } catch (error) {
    console.error('Error logging in:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
