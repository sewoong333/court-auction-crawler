'use client';

import React from 'react';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { MapPinIcon, BanknotesIcon, CalendarIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

interface AuctionImage {
  url: string;
}

interface AuctionDetail {
  key: string;
  value: string;
}

interface Auction {
  id: string;
  caseNumber: string;
  court: string;
  location: string;
  type: string;
  minimumBid: number;
  estimatedPrice: number;
  auctionDate: string;
  status: string;
  images: AuctionImage[];
  details: AuctionDetail[];
}

async function fetchAuctionDetail(id: string) {
  const response = await fetch(`/api/auctions/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch auction detail');
  }
  return response.json();
}

export default function AuctionDetail({ params }: { params: { id: string } }) {
  const { data: auction, isLoading, error } = useQuery({
    queryKey: ['auction', params.id],
    queryFn: () => fetchAuctionDetail(params.id),
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-96 bg-gray-200 rounded-lg mb-8" />
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="h-4 bg-gray-200 rounded w-5/6" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <p className="text-red-500">경매 정보를 불러오는데 실패했습니다.</p>
        </div>
      </div>
    );
  }

  if (!auction) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 이미지 갤러리 */}
        <div className="space-y-4">
          <div className="relative aspect-4/3 rounded-lg overflow-hidden">
            {auction.images?.[0]?.url ? (
              <Image
                src={auction.images[0].url}
                alt={auction.location}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400">이미지 없음</span>
              </div>
            )}
          </div>
          <div className="grid grid-cols-4 gap-2">
            {auction.images?.slice(1).map((image: AuctionImage, index: number) => (
              <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                <Image
                  src={image.url}
                  alt={`${auction.location} ${index + 2}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* 경매 정보 */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {auction.type}
            </h1>
            <p className="text-lg text-gray-600">{auction.caseNumber}</p>
          </div>

          <div className="border-t border-b border-gray-200 py-6">
            <dl className="grid grid-cols-1 gap-4">
              <div className="flex items-center">
                <dt className="flex items-center text-gray-500 w-24">
                  <MapPinIcon className="h-5 w-5 mr-2" />
                  소재지
                </dt>
                <dd className="text-gray-900">{auction.location}</dd>
              </div>
              <div className="flex items-center">
                <dt className="flex items-center text-gray-500 w-24">
                  <BanknotesIcon className="h-5 w-5 mr-2" />
                  최저가
                </dt>
                <dd className="text-gray-900 font-semibold">
                  {formatPrice(auction.minimumBid)}
                </dd>
              </div>
              <div className="flex items-center">
                <dt className="flex items-center text-gray-500 w-24">
                  <CalendarIcon className="h-5 w-5 mr-2" />
                  입찰일
                </dt>
                <dd className="text-gray-900">{auction.auctionDate}</dd>
              </div>
            </dl>
          </div>

          {/* 상세 정보 */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <DocumentTextIcon className="h-5 w-5 mr-2" />
              상세 정보
            </h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <dl className="grid grid-cols-1 gap-4">
                {auction.details?.map((detail: AuctionDetail, index: number) => (
                  <div key={index} className="flex">
                    <dt className="text-gray-500 w-32">{detail.key}</dt>
                    <dd className="text-gray-900">{detail.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          {/* 입찰 버튼 */}
          <div className="mt-8">
            <button
              type="button"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              입찰 참여하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 