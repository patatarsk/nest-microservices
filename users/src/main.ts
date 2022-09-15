import { TransportStrategy } from '@patatarsk/sqs-transport-client';
import { UsersModule } from './users.module';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';

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
    UsersModule,
    {
      strategy,
    },
  );

  await app.listen();
}
bootstrap();
