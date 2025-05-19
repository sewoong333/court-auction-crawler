import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || '';
    const court = searchParams.get('court');
    const type = searchParams.get('type');
    const minPrice = Number(searchParams.get('minPrice')) || 0;
    const maxPrice = Number(searchParams.get('maxPrice')) || Number.MAX_SAFE_INTEGER;

    const auctions = await prisma.auction.findMany({
      where: {
        OR: [
          { location: { contains: query } },
          { caseNumber: { contains: query } },
          { type: { contains: query } },
        ],
        AND: [
          court ? { court } : {},
          type ? { type } : {},
          {
            minimumBid: {
              gte: minPrice,
              lte: maxPrice,
            },
          },
        ],
      },
      include: {
        images: true,
        details: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(auctions);
  } catch (error) {
    console.error('Error fetching auctions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch auctions' },
      { status: 500 }
    );
  }
} 