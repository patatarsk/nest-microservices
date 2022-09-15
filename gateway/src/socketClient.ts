import { ClientProxy, ReadPacket, WritePacket } from '@nestjs/microservices';
import { ClientRequestArgs } from 'http';
import { WebSocket, ClientOptions } from 'ws';

export class SocketsServerClient extends ClientProxy {
  port: number;
  host: string;
  socket: WebSocket;
  opts: ClientOptions | ClientRequestArgs;

  constructor(port, host) {
    super();
    this.port = port;
    this.host = host;
    this.opts = {
      port: this.port,
      host: this.host,
    };
  }

  async connectSocket(): Promise<void> {
    return new Promise((resolve) => {
      this.socket = new WebSocket(`ws://${this.host}:${this.port}`);
      this.socket.on('open', () => {
        resolve();
      });

      this.socket.on('error', (err) => {
        console.log(err);
      });
    });
  }

  async connect(): Promise<any> {
    console.log('conected');
  }

  async close() {
    console.log('closed');
  }

  async dispatchEvent(packet: ReadPacket<any>): Promise<any> {
    const { pattern, data } = packet;
    this.socket.send(JSON.stringify({ cmd: pattern, data }));
  }

  publish(
    packet: ReadPacket<any>,
    callback: (packet: WritePacket<any>) => void,
  ): () => void {
    const { pattern, data } = packet;
    this.socket.send(JSON.stringify({ cmd: pattern, data }));
    this.socket.on('message', (message) => {
      const response = JSON.parse(message.toString());
      callback({
        response,
        isDisposed: true,
      });
    });

    return () => console.log('teardown');
  }
}
