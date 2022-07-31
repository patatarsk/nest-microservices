import { User, UserDocument } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { News, NewsDocument } from './schemas/news.schema';
import mongoose from 'mongoose';
import { Injectable } from '@nestjs/common';

@Injectable()
export class NewsService {
  constructor(
    @InjectModel(News.name) private newsModel: mongoose.Model<NewsDocument>,
    @InjectModel(User.name) private userModel: mongoose.Model<UserDocument>,
  ) {}

  async create(createNewsDto: any, ownerId: any) {
    const { owners, ...newsData } = createNewsDto;
    const ceatedNews = new this.newsModel({
      ...newsData,
    });
    const ownersIds = [...owners, ownerId];

    ceatedNews.owners.push(...ownersIds);

    await this.userModel.updateMany(
      { _id: { $in: ownersIds } },
      { $push: { news: ceatedNews._id } },
    );

    return ceatedNews.save();
  }

  findAll() {
    return this.newsModel
      .find()
      .populate('owners', { email: 1, name: 1, _id: 0 })
      .exec();
  }

  async findOne(id: string) {
    const newsData = await this.newsModel
      .aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(id) } },
        {
          $lookup: {
            localField: 'owners',
            from: 'users',
            foreignField: '_id',
            as: 'ownersdata',
            pipeline: [{ $project: { name: 1, email: 1 } }, { $unset: '_id' }],
          },
        },
        { $set: { owners: '$ownersdata' } },
        { $unset: 'ownersdata' },
      ])
      .exec();

    return newsData;
  }
}
