import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

interface RegisterData {
  email: string;
  password: string;
  name?: string;
}

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json() as RegisterData;

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: '유효하지 않은 이메일 형식입니다.' },
        { status: 400 }
      );
    }

    // 비밀번호 검증 (최소 8자, 영문/숫자/특수문자 포함)
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return NextResponse.json(
        { error: '비밀번호는 최소 8자 이상이며, 영문, 숫자, 특수문자를 포함해야 합니다.' },
        { status: 400 }
      );
    }

    // 이메일 중복 확인
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: '이미 사용 중인 이메일입니다.' },
        { status: 400 }
      );
    }

    // 비밀번호 해시화
    const hashedPassword = await bcrypt.hash(password, 10);

    // 사용자 생성
    const user = await prisma.user.create({
      data: {
        email,
        hashedPassword,
        name,
      },
    });

    // 비밀번호를 제외한 사용자 정보 반환
    const { hashedPassword: _, ...userWithoutPassword } = user;
    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error('Error registering user:', error);
    return NextResponse.json(
      { error: '회원가입에 실패했습니다.' },
      { status: 500 }
    );
  }
} 