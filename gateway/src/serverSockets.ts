import { CustomTransportStrategy, Server } from '@nestjs/microservices';
import { EventEmitter } from 'events';
import { ServerOptions, WebSocket, Server as WSServer } from 'ws';

export class SocketsServer extends Server implements CustomTransportStrategy {
  port: number;
  host: string;
  socket: WSServer<WebSocket>;
  opts: ServerOptions;
  emitter: EventEmitter;

  constructor(port, host) {
    super();
    this.port = port;
    this.host = host;
    this.opts = {
      port: this.port,
      host: this.host,
    };
    this.emitter = new EventEmitter();
    this.socket = new WebSocket.Server(this.opts);
  }

  async startServer() {
    return new Promise<void>((resolve, reject) => {
      this.socket
        .on('listening', () => {
          resolve();
        })
        .on('error', (error) => {
          reject(error);
        })
        .on('connection', (socket) => {
          socket.on('message', (message: Buffer) => {
            const { cmd, data } = JSON.parse(message.toString());
            const event = this.emitter.emit(JSON.stringify(cmd), data);

            if (!event) {
              console.log(`event: ${cmd} not found`);
            }
          });
        });
    });
  }

  listen(callback: () => void) {
    this.messageHandlers.forEach((handler, pattern) => {
      this.emitter.on(pattern, async (data: any) => {
        if (handler.isEventHandler === true) {
          handler(data);
        } else {
          const responce = await handler(data);
          this.socket.clients.forEach((client) => {
            client.send(JSON.stringify(responce));
          });
        }
      });
    });

    callback();
  }

  close() {
    this.socket.close();
  }
}
