import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { NewsModule } from './news.module';

const { PORT, HOST } = process.env;

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    NewsModule,
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
