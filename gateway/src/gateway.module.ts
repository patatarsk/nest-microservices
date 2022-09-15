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
import { TransportStrategy, SQSClient } from '@patatarsk/sqs-transport-client';

const { AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, HOST } =
  process.env;

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
      provide: 'SQS_TRANSPORT',
      useFactory: async () => {
        const transport = new TransportStrategy({
          region: AWS_REGION,
          credentials: {
            accessKeyId: AWS_ACCESS_KEY_ID,
            secretAccessKey: AWS_SECRET_ACCESS_KEY,
          },
        });

        return transport;
      },
    },
    {
      provide: 'SQS_SERVICE',
      useFactory: async () => {
        const client = new SQSClient(
          {
            region: AWS_REGION,
            credentials: {
              accessKeyId: AWS_ACCESS_KEY_ID,
              secretAccessKey: AWS_SECRET_ACCESS_KEY,
            },
          },
          HOST,
        );

        await client.initReceiver();

        return client;
      },
    },
  ],
})
export class AppModule {}
