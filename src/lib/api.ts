import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
})

export interface AuctionData {
  id: string
  title: string
  location: string
  price: number
  imageUrl: string
  auctionDate: string
  description?: string
}

export const auctionApi = {
  getAuctions: async (): Promise<AuctionData[]> => {
    const response = await api.get('/auctions')
    return response.data
  },

  getAuctionById: async (id: string): Promise<AuctionData> => {
    const response = await api.get(`/auctions/${id}`)
    return response.data
  },

  searchAuctions: async (query: string): Promise<AuctionData[]> => {
    const response = await api.get('/auctions/search', {
      params: { q: query },
    })
    return response.data
  },
} 