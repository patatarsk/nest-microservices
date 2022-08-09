import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './gateway.module';
import { Worker } from 'worker_threads';
import { join, extname } from 'path';

const workerPath = join(__dirname, 'mailer/main' + extname(__filename));

const { PORT, REDIS_PORT, HOST } = process.env;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const microservice = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.REDIS,
    options: {
      host: HOST,
      port: +REDIS_PORT,
    },
  });

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const config = new DocumentBuilder()
    .setTitle('Nest microservice api')
    .setDescription('Nest microservice API description')
    .setVersion('1.0')
    .addTag('Nest microservice api')
    .addBearerAuth(
      {
        description: `[just text field] Please enter token in following format: Bearer <JWT>`,
        name: 'Authorization',
        bearerFormat: 'Bearer',
        scheme: 'Bearer',
        type: 'http',
        in: 'Header',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const mailer = new Worker(workerPath);

  mailer.on('error', (error) => {
    console.log(error);
  });

  await app.startAllMicroservices();
  await app.listen(PORT);
}
bootstrap();
