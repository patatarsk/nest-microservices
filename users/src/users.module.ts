import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';

const { MONGODB_URL, MONGODB_DATABASE } = process.env;

@Module({
  imports: [
    MongooseModule.forRoot(MONGODB_URL, {
      dbName: MONGODB_DATABASE,
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
