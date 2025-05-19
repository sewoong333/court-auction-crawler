import Image from 'next/image'
import Link from 'next/link'

interface AuctionCardProps {
  id: string
  title: string
  location: string
  price: number
  imageUrl: string
  auctionDate: string
}

export default function AuctionCard({
  id,
  title,
  location,
  price,
  imageUrl,
  auctionDate,
}: AuctionCardProps) {
  return (
    <Link href={`/auctions/${id}`} className="block">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <div className="relative h-48">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <p className="text-gray-600 mb-2">{location}</p>
          <p className="text-primary font-bold">
            {price.toLocaleString()}원
          </p>
          <p className="text-sm text-gray-500 mt-2">
            경매일: {auctionDate}
          </p>
        </div>
      </div>
    </Link>
  )
} 