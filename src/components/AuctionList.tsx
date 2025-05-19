'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPinIcon, BanknotesIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { useQuery } from '@tanstack/react-query';

interface AuctionItem {
  id: string;
  caseNumber: string;
  court: string;
  location: string;
  type: string;
  minimumBid: number;
  estimatedPrice: number;
  auctionDate: string;
  status: string;
  images: { url: string }[];
}

interface AuctionListProps {
  searchQuery: string;
  selectedCourts?: string[];
  selectedTypes?: string[];
  priceRange?: [number, number];
}

async function fetchAuctions(params: {
  query?: string;
  court?: string;
  type?: string;
  minPrice?: number;
  maxPrice?: number;
}) {
  const searchParams = new URLSearchParams();
  if (params.query) searchParams.set('query', params.query);
  if (params.court) searchParams.set('court', params.court);
  if (params.type) searchParams.set('type', params.type);
  if (params.minPrice !== undefined) searchParams.set('minPrice', params.minPrice.toString());
  if (params.maxPrice !== undefined) searchParams.set('maxPrice', params.maxPrice.toString());

  const response = await fetch(`/api/auctions?${searchParams.toString()}`);
  if (!response.ok) {
    throw new Error('Failed to fetch auctions');
  }
  return response.json();
}

export default function AuctionList({
  searchQuery,
  selectedCourts = [],
  selectedTypes = [],
  priceRange = [0, Number.MAX_SAFE_INTEGER],
}: AuctionListProps) {
  const { data: auctions = [], isLoading, error } = useQuery({
    queryKey: ['auctions', searchQuery, selectedCourts, selectedTypes, priceRange],
    queryFn: () => fetchAuctions({
      query: searchQuery,
      court: selectedCourts.length === 1 ? selectedCourts[0] : undefined,
      type: selectedTypes.length === 1 ? selectedTypes[0] : undefined,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
    }),
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
            <div className="h-48 bg-gray-200" />
            <div className="p-4 space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="h-4 bg-gray-200 rounded w-5/6" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">데이터를 불러오는데 실패했습니다. 다시 시도해주세요.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {auctions.map((auction: AuctionItem) => (
        <Link
          key={auction.id}
          href={`/auctions/${auction.id}`}
          className="block"
        >
          <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
            <div className="relative h-48">
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
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  {auction.type}
                </h3>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {auction.status}
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-2">{auction.caseNumber}</p>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-500">
                  <MapPinIcon className="h-4 w-4 mr-2" />
                  {auction.location}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <BanknotesIcon className="h-4 w-4 mr-2" />
                  <span className="font-medium text-gray-900">
                    {formatPrice(auction.minimumBid)}
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  {auction.auctionDate}
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
} 