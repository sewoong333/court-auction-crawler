import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-primary">
            누나옥션
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/auctions" className="hover:text-primary">
              경매물건
            </Link>
            <Link href="/favorites" className="hover:text-primary">
              관심물건
            </Link>
            <Link href="/calendar" className="hover:text-primary">
              경매일정
            </Link>
          </div>
        </div>
      </nav>
    </header>
  )
} 