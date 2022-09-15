import { HttpException, ValidationPipe, HttpStatus } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './gateway.module';
import { Worker } from 'worker_threads';
import { join, extname } from 'path';

const workerPath = join(__dirname, 'mailer/main' + extname(__filename));

const { PORT } = process.env;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
    throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
  });

  await app.listen(PORT);
}
bootstrap();
