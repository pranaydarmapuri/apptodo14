import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '@/models/user';

export async function connect() {
  try {
    const mongoURI = process.env.MONGO_URI;

    if (!mongoURI) {
      throw new Error('MONGO_URI environment variable is not defined');
    }

    mongoose.connect(mongoURI);
    console.log('Connected to DB');
  } catch (error) {
    console.error('Failed to connect to DB', error);
    throw error;
  }
}

export function generateToken(payload: any) {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error('JWT_SECRET environment variable is not defined');
  }

  const token = jwt.sign(payload, jwtSecret, { expiresIn: '1h' });
  return token;
}

export async function saveUser(username: string, password: string) {
  try {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = new User({
      username,
      passwordHash,
    });

    await user.save();
    console.log('User saved successfully');
  } catch (error) {
    console.error('Failed to save user', error);
    throw error;
  }
}
