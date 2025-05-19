import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '@/lib/auth';

const prisma = new PrismaClient();

// 관심 목록 조회
export async function GET(request: Request) {
  const auth = await authenticate(request);
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const watchlist = await prisma.watchlistItem.findMany({
      where: { userId: auth.user.id },
      include: {
        auction: {
          include: {
            images: true,
          },
        },
      },
    });

    return NextResponse.json(watchlist);
  } catch (error) {
    console.error('Error fetching watchlist:', error);
    return NextResponse.json(
      { error: '관심 목록을 불러오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}

interface WatchlistData {
  auctionId: string;
}

// 관심 목록에 추가
export async function POST(request: Request) {
  const auth = await authenticate(request);
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const { auctionId } = await request.json() as WatchlistData;

    // 경매 물건 존재 여부 확인
    const auction = await prisma.auction.findUnique({
      where: { id: auctionId },
    });

    if (!auction) {
      return NextResponse.json(
        { error: '존재하지 않는 경매 물건입니다.' },
        { status: 404 }
      );
    }

    // 이미 관심 목록에 있는지 확인
    const existingItem = await prisma.watchlistItem.findFirst({
      where: {
        userId: auth.user.id,
        auctionId,
      },
    });

    if (existingItem) {
      return NextResponse.json(
        { error: '이미 관심 목록에 추가된 물건입니다.' },
        { status: 400 }
      );
    }

    // 관심 목록에 추가
    const watchlistItem = await prisma.watchlistItem.create({
      data: {
        userId: auth.user.id,
        auctionId,
      },
      include: {
        auction: {
          include: {
            images: true,
          },
        },
      },
    });

    return NextResponse.json(watchlistItem);
  } catch (error) {
    console.error('Error adding to watchlist:', error);
    return NextResponse.json(
      { error: '관심 목록에 추가하는데 실패했습니다.' },
      { status: 500 }
    );
  }
}

// 관심 목록에서 제거
export async function DELETE(request: Request) {
  const auth = await authenticate(request);
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const { auctionId } = await request.json() as WatchlistData;

    // 관심 목록에서 제거
    await prisma.watchlistItem.deleteMany({
      where: {
        userId: auth.user.id,
        auctionId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing from watchlist:', error);
    return NextResponse.json(
      { error: '관심 목록에서 제거하는데 실패했습니다.' },
      { status: 500 }
    );
  }
} 