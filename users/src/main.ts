import { SocketsServer } from './serverSockets';
import { UsersModule } from './users.module';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';

const { PORT, HOST } = process.env;

async function bootstrap() {
  const strategy = new SocketsServer(PORT, HOST);
  await strategy.startServer();
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    UsersModule,
    {
      strategy,
    },
  );

  await app.listen();
}
bootstrap();
