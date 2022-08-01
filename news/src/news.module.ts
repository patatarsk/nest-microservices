import { User, UserSchema } from './schemas/user.schema';
import { NewsSchema, News } from './schemas/news.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { NewsService } from './news.service';
import { NewsController } from './news.controller';

const { MONGODB_URL, MONGODB_DATABASE } = process.env;

const newsModel = MongooseModule.forFeature([
  { name: News.name, schema: NewsSchema },
]);

const usersModel = MongooseModule.forFeature([
  { name: User.name, schema: UserSchema },
]);

@Module({
  imports: [
    MongooseModule.forRoot(MONGODB_URL, {
      dbName: MONGODB_DATABASE,
    }),
    newsModel,
    usersModel,
  ],
  controllers: [NewsController],
  providers: [NewsService],
})
export class NewsModule {}
