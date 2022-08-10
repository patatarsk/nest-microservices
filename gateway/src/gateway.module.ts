import { NewsController } from './controllers/news.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { jwtConstants } from './constants';
import { AuthController } from './controllers/auth.controller';
import { UsersController } from './controllers/users.controller';
import { Module } from '@nestjs/common';
import { AppController } from './gateway.controller';
import { AppService } from './gateway.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { SocketsServer } from './serverSockets';
import { SocketsServerClient } from './socketClient';

const {
  SOCKET_HOST,
  SOCKET_PORT,
  NEWS_PORT,
  NEWS_HOST,
  USERS_PORT,
  USERS_HOST,
} = process.env;

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AppController, UsersController, AuthController, NewsController],
  providers: [
    AppService,
    LocalStrategy,
    JwtStrategy,
    {
      provide: 'SOCKET_SERVER',
      useFactory: async () => {
        const server = await new SocketsServer(SOCKET_PORT, SOCKET_HOST);
        await server.startServer();
        return server;
      },
    },
    {
      provide: 'NEWS_SERVICE',
      useFactory: async () => {
        const client = await new SocketsServerClient(NEWS_PORT, NEWS_HOST);
        await client.connectSocket();
        return client;
      },
    },
    {
      provide: 'USERS_SERVICE',
      useFactory: async () => {
        const client = await new SocketsServerClient(USERS_PORT, USERS_HOST);
        await client.connectSocket();
        return client;
      },
    },
  ],
})
export class AppModule {}
