import { Server as HttpServer } from 'http';
import { WebSocketServer as WS } from 'ws';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

interface WebSocketClient extends WebSocket {
  userId?: string;
  isAlive: boolean;
}

export class WebSocketServer {
  private wss: WS;
  private clients: Map<string, Set<WebSocketClient>>;

  constructor(server: HttpServer) {
    this.wss = new WS({ server });
    this.clients = new Map();

    this.wss.on('connection', this.handleConnection.bind(this));
    this.startHeartbeat();
  }

  private async handleConnection(ws: WebSocketClient, req: any) {
    ws.isAlive = true;
    ws.on('pong', () => { ws.isAlive = true; });

    // 토큰 검증
    const token = req.url?.split('token=')[1];
    if (!token) {
      ws.close(1008, 'Authentication required');
      return;
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
      ws.userId = decoded.userId;

      // 사용자별 클라이언트 관리
      if (!this.clients.has(ws.userId)) {
        this.clients.set(ws.userId, new Set());
      }
      this.clients.get(ws.userId)?.add(ws);

      // 연결 해제 처리
      ws.on('close', () => {
        this.clients.get(ws.userId!)?.delete(ws);
        if (this.clients.get(ws.userId!)?.size === 0) {
          this.clients.delete(ws.userId!);
        }
      });

    } catch (error) {
      ws.close(1008, 'Invalid token');
    }
  }

  private startHeartbeat() {
    setInterval(() => {
      this.wss.clients.forEach((ws: WebSocketClient) => {
        if (!ws.isAlive) {
          return ws.terminate();
        }
        ws.isAlive = false;
        ws.ping();
      });
    }, 30000);
  }

  // 특정 사용자에게 알림 전송
  public sendNotification(userId: string, notification: any) {
    const userClients = this.clients.get(userId);
    if (userClients) {
      const message = JSON.stringify(notification);
      userClients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
      });
    }
  }

  // 모든 사용자에게 알림 전송
  public broadcastNotification(notification: any) {
    const message = JSON.stringify(notification);
    this.wss.clients.forEach((client: WebSocketClient) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }

  // 관심 목록 변경 알림
  public async sendWatchlistNotification(auctionId: string) {
    try {
      const auction = await prisma.auction.findUnique({
        where: { id: auctionId },
        include: {
          watchlist: {
            include: {
              user: true
            }
          }
        }
      });

      if (auction) {
        auction.watchlist.forEach(item => {
          this.sendNotification(item.userId, {
            type: 'AUCTION_UPDATE',
            auction: {
              id: auction.id,
              caseNumber: auction.caseNumber,
              status: auction.status,
              minimumBid: auction.minimumBid
            }
          });
        });
      }
    } catch (error) {
      console.error('Error sending watchlist notification:', error);
    }
  }
} 