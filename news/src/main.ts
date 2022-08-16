import { TransportStrategy } from '@patatarsk/sqs-transport-client';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { NewsModule } from './news.module';

const { AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } = process.env;

async function bootstrap() {
  const strategy = new TransportStrategy({
    region: AWS_REGION,
    credentials: {
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_ACCESS_KEY,
    },
  });

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    NewsModule,
    {
      strategy,
    },
  );

  await app.listen();
}
bootstrap();
