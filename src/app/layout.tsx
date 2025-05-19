import React from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import Notifications from '@/components/Notifications'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '법원 경매 정보',
  description: '전국의 법원 경매 물건을 한 눈에 확인하세요',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex-shrink-0">
                <h1 className="text-xl font-bold text-gray-900">법원 경매 정보</h1>
              </div>
              <div className="flex items-center">
                <Notifications />
              </div>
            </div>
          </div>
        </header>
        <Providers>
          <main className="min-h-screen bg-gray-100">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  )
} 