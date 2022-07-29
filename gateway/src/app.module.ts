import { UsersController } from './users.controller';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';

const { USERS_SERVICE_PORT, USERS_SERVICE_HOST } = process.env;

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'API_SERVICE',
        transport: Transport.TCP,
        options: {
          port: +USERS_SERVICE_PORT,
          host: USERS_SERVICE_HOST,
        },
      },
    ]),
  ],
  controllers: [AppController, UsersController],
  providers: [AppService],
})
export class AppModule {}
