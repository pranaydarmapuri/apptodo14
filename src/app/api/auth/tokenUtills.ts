import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const secretKey = process.env.JWT_SECRET || ''; // Use the environment variable

export function generateToken(data: Record<string, any>): string {
  return jwt.sign(data, secretKey, { expiresIn: '1h' });
}

export function verifyToken(request: NextRequest): Record<string, any> | null {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    return decoded as Record<string, any>;
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
}
