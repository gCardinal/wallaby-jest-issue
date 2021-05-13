import * as WebSocket from 'ws';
import { AddressInfo } from 'ws';

export class MockWebsocketServer {
  private server: WebSocket.Server;

  public getAddress(): string {
    return `localhost:${(this.server.address() as AddressInfo).port}`;
  }

  public async start(): Promise<void> {
    await this.close();

    return new Promise((resolve) => {
      this.server = new WebSocket.Server({ port: 0 });

      this.server.on('listening', () => {
        resolve();
      });
    });
  }

  public async close(): Promise<void> {
    return new Promise((resolve) => {
      if (this.server) {
        this.server.close(() => {
          resolve();
        });
      } else {
        resolve();
      }
    });
  }

  public broadcast(
    messages: Array<string | Blob | ArrayBuffer | ArrayBufferView>,
  ) {
    this.server.on('connection', () => {
      this.server.clients.forEach((client) => {
        messages.forEach((message) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(message);
          }
        });
      });
    });
  }
}
