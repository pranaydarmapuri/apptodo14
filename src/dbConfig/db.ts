import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';


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

//We are adding this function to generate JWT token
export function generateToken(payload: any) {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error('JWT_SECRET environment variable is not defined');
  }

  const token = jwt.sign(payload, jwtSecret, { expiresIn: '1h' });
  return token;
}
