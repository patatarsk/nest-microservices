import { SocketsServer } from './serverSockets';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { NewsModule } from './news.module';

const { PORT, HOST } = process.env;

async function bootstrap() {
  const strategy = new SocketsServer(PORT, HOST);
  await strategy.startServer();
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    NewsModule,
    {
      strategy,
    },
  );

  await app.listen();
}
bootstrap();
