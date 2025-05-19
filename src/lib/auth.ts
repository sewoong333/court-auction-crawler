import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import jwt from 'jsonwebtoken';
import { PrismaClient, User } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

interface JwtPayload {
  userId: string;
  email: string;
}

interface AuthResponse {
  user?: User;
  error?: string;
  status: number;
}

export async function authenticate(request: Request): Promise<AuthResponse> {
  try {
    const headersList = headers();
    const authorization = headersList.get('Authorization');

    if (!authorization || !authorization.startsWith('Bearer ')) {
      return {
        error: '인증이 필요합니다.',
        status: 401,
      };
    }

    const token = authorization.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return {
        error: '유효하지 않은 사용자입니다.',
        status: 401,
      };
    }

    return {
      user,
      status: 200,
    };
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return {
        error: '토큰이 만료되었습니다.',
        status: 401,
      };
    }

    return {
      error: '인증에 실패했습니다.',
      status: 401,
    };
  }
}

interface TokenResponse {
  accessToken?: string;
  error?: string;
  status: number;
}

export async function refreshAccessToken(refreshToken: string): Promise<TokenResponse> {
  try {
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!storedToken || storedToken.expiresAt < new Date()) {
      return {
        error: '유효하지 않은 리프레시 토큰입니다.',
        status: 401,
      };
    }

    const newAccessToken = jwt.sign(
      { userId: storedToken.user.id, email: storedToken.user.email },
      JWT_SECRET,
      { expiresIn: '30m' }
    );

    return {
      accessToken: newAccessToken,
      status: 200,
    };
  } catch (error) {
    return {
      error: '토큰 갱신에 실패했습니다.',
      status: 500,
    };
  }
} 