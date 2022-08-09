import { UsersModule } from './users.module';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

const { PORT, HOST } = process.env;

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    UsersModule,
    {
      transport: Transport.REDIS,
      options: {
        port: +PORT,
        host: HOST,
      },
    },
  );

  await app.listen();
}
bootstrap();
