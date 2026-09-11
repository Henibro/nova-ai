import { WebSocketServer, WebSocket } from 'ws';
import type { Server } from 'http';

interface ClientConnection {
  ws: WebSocket;
  projectId: string;
  isAlive: boolean;
  connectedAt: Date;
}

class WebSocketService {
  private wss: WebSocketServer | null = null;
  private clients: Set<ClientConnection> = new Set();
  private pingInterval: NodeJS.Timeout | null = null;

  public init(server: Server) {
    this.wss = new WebSocketServer({ server, path: '/ws' });

    this.wss.on('connection', (ws: WebSocket, req) => {
      // Default to demo or extract project from query
      const url = new URL(req.url || '', 'http://localhost');
      const projectId = url.searchParams.get('projectId') || 'project_aether_demo';

      const client: ClientConnection = {
        ws,
        projectId,
        isAlive: true,
        connectedAt: new Date(),
      };

      this.clients.add(client);

      // Send initial welcome & connection confirmation
      ws.send(
        JSON.stringify({
          type: 'connection:status',
          status: 'connected',
          timestamp: new Date().toISOString(),
          projectId,
          clientCount: this.clients.size,
        })
      );

      ws.on('message', (message: string) => {
        try {
          const data = JSON.parse(message.toString());
          if (data.type === 'subscribe:project') {
            client.projectId = data.projectId || client.projectId;
            ws.send(
              JSON.stringify({
                type: 'subscribed',
                projectId: client.projectId,
              })
            );
          } else if (data.type === 'pong' || data.type === 'heartbeat') {
            client.isAlive = true;
          }
        } catch {
          // ignore malformed ws messages
        }
      });

      ws.on('pong', () => {
        client.isAlive = true;
      });

      ws.on('close', () => {
        this.clients.delete(client);
      });

      ws.on('error', () => {
        this.clients.delete(client);
      });
    });

    // Heartbeat cleanup every 30s
    this.pingInterval = setInterval(() => {
      for (const client of this.clients) {
        if (!client.isAlive) {
          client.ws.terminate();
          this.clients.delete(client);
          continue;
        }
        client.isAlive = false;
        try {
          client.ws.ping();
        } catch {
          this.clients.delete(client);
        }
      }
    }, 30000);
  }

  public broadcast(type: string, payload: any, targetProjectId?: string) {
    if (!this.wss) return;

    const message = JSON.stringify({
      type,
      payload,
      timestamp: new Date().toISOString(),
    });

    for (const client of this.clients) {
      if (client.ws.readyState === WebSocket.OPEN) {
        if (!targetProjectId || client.projectId === targetProjectId || client.projectId === 'all') {
          try {
            client.ws.send(message);
          } catch {
            this.clients.delete(client);
          }
        }
      }
    }
  }

  public getConnectedClientsCount(): number {
    return this.clients.size;
  }
}

export const websocketService = new WebSocketService();
