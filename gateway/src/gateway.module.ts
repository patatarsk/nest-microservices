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

const { REDIS_PORT, HOST } = process.env;

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
        transport: Transport.REDIS,
        options: {
          port: +REDIS_PORT,
          host: HOST,
        },
      },
      {
        name: 'NEWS_SERVICE',
        transport: Transport.REDIS,
        options: {
          port: +REDIS_PORT,
          host: HOST,
        },
      },
    ]),
  ],
  controllers: [AppController, UsersController, AuthController, NewsController],
  providers: [AppService, LocalStrategy, JwtStrategy],
})
export class AppModule {}
