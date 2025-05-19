'use client';

import React, { useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import AuctionList from '@/components/AuctionList';
import SearchFilters from '@/components/SearchFilters';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourts, setSelectedCourts] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000000]);

  const handleFiltersChange = (
    courts: string[],
    types: string[],
    range: [number, number]
  ) => {
    setSelectedCourts(courts);
    setSelectedTypes(types);
    setPriceRange(range);
  };
  
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            법원 경매 물건 검색
          </h1>
          <p className="text-lg text-gray-600">
            전국의 법원 경매 물건을 한 눈에 확인하세요
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto mb-8">
          <div className="flex gap-4 items-center bg-white rounded-lg shadow-sm p-2">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="지역, 물건종류, 사건번호로 검색"
              className="flex-1 border-0 focus:ring-0 text-gray-900 placeholder-gray-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <SearchFilters
              onFiltersChange={handleFiltersChange}
              selectedCourts={selectedCourts}
              selectedTypes={selectedTypes}
              priceRange={priceRange}
            />
          </div>
          <div className="lg:col-span-3">
            <AuctionList
              searchQuery={searchQuery}
              selectedCourts={selectedCourts}
              selectedTypes={selectedTypes}
              priceRange={priceRange}
            />
          </div>
        </div>
      </div>
    </main>
  );
} 