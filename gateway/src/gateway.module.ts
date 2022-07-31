import { NewsController } from './controllers/news.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { jwtConstants } from './constants';
import { AuthController } from './controllers/auth.controller';
import { UsersController } from './controllers/users.controller';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './gateway.controller';
import { AppService } from './gateway.service';
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
