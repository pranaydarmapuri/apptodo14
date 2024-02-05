import jwt from 'jsonwebtoken'
import { NextRequest } from 'next/server'

const secretKey = process.env.JWT_SECRET || '' // Use the environment variable

export function generateToken(data: Record<string, any>): string {
  return jwt.sign(data, secretKey, { expiresIn: '1h' })
}

export function verifyToken(request: NextRequest): Record<string, any> | null {
  const [_, token] = request.headers.get('Authorization')?.split(' ') ?? [undefined, undefined]

  if (!token) return null

  try {
    const decoded = jwt.verify(token, secretKey)
    return decoded as Record<string, any>
  } catch (error) {
    console.error('JWT verification failed:', error)
    return null
  }
}
