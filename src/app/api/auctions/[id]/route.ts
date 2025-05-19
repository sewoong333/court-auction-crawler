import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  try {
    const auction = await prisma.auction.findUnique({
      where: { id },
      include: {
        images: true,
        details: true,
      },
    });

    if (!auction) {
      return new Response(JSON.stringify({ error: 'Auction not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(auction), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching auction:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch auction' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
} 