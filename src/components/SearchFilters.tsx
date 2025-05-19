'use client';

import React, { useEffect } from 'react';
import { Disclosure } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/24/outline';

const courts = [
  '서울중앙지방법원',
  '서울동부지방법원',
  '서울남부지방법원',
  '서울북부지방법원',
  '서울서부지방법원',
  '의정부지방법원',
  '인천지방법원',
];

const propertyTypes = [
  '아파트',
  '주택',
  '토지',
  '상가',
  '오피스텔',
  '공장',
  '농지',
];

interface SearchFiltersProps {
  onFiltersChange: (courts: string[], types: string[], priceRange: [number, number]) => void;
  selectedCourts: string[];
  selectedTypes: string[];
  priceRange: [number, number];
}

export default function SearchFilters({
  onFiltersChange,
  selectedCourts,
  selectedTypes,
  priceRange,
}: SearchFiltersProps) {
  const toggleCourt = (court: string) => {
    const newCourts = selectedCourts.includes(court)
      ? selectedCourts.filter(c => c !== court)
      : [...selectedCourts, court];
    onFiltersChange(newCourts, selectedTypes, priceRange);
  };

  const toggleType = (type: string) => {
    const newTypes = selectedTypes.includes(type)
      ? selectedTypes.filter(t => t !== type)
      : [...selectedTypes, type];
    onFiltersChange(selectedCourts, newTypes, priceRange);
  };

  const handlePriceChange = (min: number, max: number) => {
    onFiltersChange(selectedCourts, selectedTypes, [min, max]);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <Disclosure defaultOpen>
        {({ open }) => (
          <>
            <Disclosure.Button className="flex w-full justify-between rounded-lg bg-gray-50 px-4 py-2 text-left text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus-visible:ring">
              <span>법원</span>
              <ChevronUpIcon
                className={`${
                  open ? 'rotate-180 transform' : ''
                } h-5 w-5 text-gray-500`}
              />
            </Disclosure.Button>
            <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
              <div className="space-y-2">
                {courts.map(court => (
                  <label key={court} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedCourts.includes(court)}
                      onChange={() => toggleCourt(court)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>{court}</span>
                  </label>
                ))}
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>

      <Disclosure as="div" className="mt-4" defaultOpen>
        {({ open }) => (
          <>
            <Disclosure.Button className="flex w-full justify-between rounded-lg bg-gray-50 px-4 py-2 text-left text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus-visible:ring">
              <span>물건종류</span>
              <ChevronUpIcon
                className={`${
                  open ? 'rotate-180 transform' : ''
                } h-5 w-5 text-gray-500`}
              />
            </Disclosure.Button>
            <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
              <div className="space-y-2">
                {propertyTypes.map(type => (
                  <label key={type} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedTypes.includes(type)}
                      onChange={() => toggleType(type)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>{type}</span>
                  </label>
                ))}
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>

      <Disclosure as="div" className="mt-4" defaultOpen>
        {({ open }) => (
          <>
            <Disclosure.Button className="flex w-full justify-between rounded-lg bg-gray-50 px-4 py-2 text-left text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus-visible:ring">
              <span>가격범위</span>
              <ChevronUpIcon
                className={`${
                  open ? 'rotate-180 transform' : ''
                } h-5 w-5 text-gray-500`}
              />
            </Disclosure.Button>
            <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    최소가격 (만원)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    value={priceRange[0] / 10000}
                    onChange={(e) => handlePriceChange(parseInt(e.target.value) * 10000, priceRange[1])}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    최대가격 (만원)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    value={priceRange[1] / 10000}
                    onChange={(e) => handlePriceChange(priceRange[0], parseInt(e.target.value) * 10000)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </div>
  );
} 