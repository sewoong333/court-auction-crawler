import axios from 'axios';
import * as cheerio from 'cheerio';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface AuctionData {
  caseNumber: string;
  court: string;
  location: string;
  type: string;
  minimumBid: number;
  estimatedPrice: number;
  auctionDate: Date;
  status: string;
  images: string[];
  details: { key: string; value: string }[];
}

async function fetchAuctionList(page: number = 1): Promise<AuctionData[]> {
  try {
    // 실제 법원 경매 사이트 URL로 변경해야 합니다
    const response = await axios.get(`https://www.courtauction.go.kr/RetrieveRealEstMulDetailList.laf?page=${page}`);
    const $ = cheerio.load(response.data);
    const auctions: AuctionData[] = [];

    // 실제 DOM 구조에 맞게 수정해야 합니다
    $('.auction-item').each((_, element) => {
      const auction: AuctionData = {
        caseNumber: $(element).find('.case-number').text().trim(),
        court: $(element).find('.court').text().trim(),
        location: $(element).find('.location').text().trim(),
        type: $(element).find('.type').text().trim(),
        minimumBid: parseInt($(element).find('.minimum-bid').text().replace(/[^0-9]/g, '')),
        estimatedPrice: parseInt($(element).find('.estimated-price').text().replace(/[^0-9]/g, '')),
        auctionDate: new Date($(element).find('.auction-date').text().trim()),
        status: $(element).find('.status').text().trim(),
        images: $(element)
          .find('.images img')
          .map((_, img) => $(img).attr('src'))
          .get(),
        details: $(element)
          .find('.details tr')
          .map((_, tr) => ({
            key: $(tr).find('th').text().trim(),
            value: $(tr).find('td').text().trim(),
          }))
          .get(),
      };
      auctions.push(auction);
    });

    return auctions;
  } catch (error) {
    console.error('Error fetching auction list:', error);
    return [];
  }
}

async function saveAuctionData(auction: AuctionData) {
  try {
    const existingAuction = await prisma.auction.findUnique({
      where: { caseNumber: auction.caseNumber },
    });

    if (existingAuction) {
      // 기존 데이터 업데이트
      await prisma.auction.update({
        where: { id: existingAuction.id },
        data: {
          court: auction.court,
          location: auction.location,
          type: auction.type,
          minimumBid: auction.minimumBid,
          estimatedPrice: auction.estimatedPrice,
          auctionDate: auction.auctionDate,
          status: auction.status,
          images: {
            deleteMany: {},
            create: auction.images.map(url => ({ url })),
          },
          details: {
            deleteMany: {},
            create: auction.details.map(({ key, value }) => ({ key, value })),
          },
        },
      });
    } else {
      // 새로운 데이터 생성
      await prisma.auction.create({
        data: {
          caseNumber: auction.caseNumber,
          court: auction.court,
          location: auction.location,
          type: auction.type,
          minimumBid: auction.minimumBid,
          estimatedPrice: auction.estimatedPrice,
          auctionDate: auction.auctionDate,
          status: auction.status,
          images: {
            create: auction.images.map(url => ({ url })),
          },
          details: {
            create: auction.details.map(({ key, value }) => ({ key, value })),
          },
        },
      });
    }
  } catch (error) {
    console.error('Error saving auction data:', error);
  }
}

export async function crawlAuctions(pages: number = 10) {
  for (let page = 1; page <= pages; page++) {
    console.log(`Crawling page ${page}...`);
    const auctions = await fetchAuctionList(page);
    for (const auction of auctions) {
      await saveAuctionData(auction);
    }
  }
  console.log('Crawling completed!');
}

// 크롤링 실행
if (require.main === module) {
  crawlAuctions().finally(() => prisma.$disconnect());
} 