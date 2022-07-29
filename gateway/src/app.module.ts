import { NewsController } from './news.controller';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';
import { jwtConstants } from './constants';
import { AuthController } from './auth.controller';
import { UsersController } from './users.controller';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

const {
  USERS_SERVICE_PORT,
  USERS_SERVICE_HOST,
  NEWS_SERVICE_PORT,
  NEWS_SERVICE_HOST,
} = process.env;

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1h' },
    }),
    ClientsModule.register([
      {
        name: 'USERS_SERVICE',
        transport: Transport.TCP,
        options: {
          port: +USERS_SERVICE_PORT,
          host: USERS_SERVICE_HOST,
        },
      },
      {
        name: 'NEWS_SERVICE',
        transport: Transport.TCP,
        options: {
          port: +NEWS_SERVICE_PORT,
          host: NEWS_SERVICE_HOST,
        },
      },
    ]),
  ],
  controllers: [AppController, UsersController, AuthController, NewsController],
  providers: [AppService, LocalStrategy, JwtStrategy],
})
export class AppModule {}
