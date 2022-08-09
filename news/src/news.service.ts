import { User, UserDocument } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { News, NewsDocument } from './schemas/news.schema';
import mongoose from 'mongoose';
import { Injectable } from '@nestjs/common';
import { S3, DynamoDB } from 'aws-sdk';
import { PutObjectRequest } from 'aws-sdk/clients/s3';
import { BatchWriteItemInput, ScanInput } from 'aws-sdk/clients/dynamodb';
import { v4 } from 'uuid';

@Injectable()
export class NewsService {
  constructor(
    @InjectModel(News.name) private newsModel: mongoose.Model<NewsDocument>,
    @InjectModel(User.name) private userModel: mongoose.Model<UserDocument>,
  ) {}

  async connectToS3() {
    const s3 = new S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });

    return s3;
  }

  async connectToDynamoDb() {
    const dynamoDb = new DynamoDB.DocumentClient({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });

    return dynamoDb;
  }

  async saveFilesInAwsS3Bucket(files: Express.Multer.File[]) {
    const s3 = await this.connectToS3();

    const filesData = await Promise.all(
      files.map(async (file) => {
        const { originalname, buffer } = file;
        const params: PutObjectRequest = {
          Bucket: process.env.AWS_BUCKET,
          Body: Buffer.from(buffer),
          Key: originalname,
          ACL: 'public-read',
        };

        return s3.upload(params).promise();
      }),
    );

    return filesData.map(({ Location }) => Location);
  }

  async saveImagePathsInDynamoDb(newsId, paths) {
    const dynamoDb = await this.connectToDynamoDb();

    const items = paths.map((path) => ({
      PutRequest: {
        Item: {
          id: v4(),
          newsId: newsId.toString(),
          photoPath: path,
        },
      },
    }));

    const params: BatchWriteItemInput = {
      RequestItems: {
        [process.env.AWS_DYNAMO_DB_TABLE]: items,
      },
    };

    return dynamoDb.batchWrite(params).promise();
  }

  async getImagePathsFromDynamoDb(newsId) {
    const dynamoDb = await this.connectToDynamoDb();

    const params: ScanInput = {
      TableName: process.env.AWS_DYNAMO_DB_TABLE,
      ExpressionAttributeValues: {
        ':id': newsId.toString(),
      },
      FilterExpression: 'newsId = :id',
      ProjectionExpression: 'photoPath',
    };

    const imagePaths = await dynamoDb.scan(params).promise();

    return imagePaths.Items.map(({ photoPath }) => photoPath);
  }

  async create(createNewsDto: any, ownerId: any, images) {
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

    const news = await ceatedNews.save();

    if (images.length) {
      const savedFilesInS3 = await this.saveFilesInAwsS3Bucket(images);
      await this.saveImagePathsInDynamoDb(ceatedNews._id, savedFilesInS3);
      news.images = savedFilesInS3;
    }

    return news;
  }

  async findAll() {
    const newsData = await this.newsModel
      .find()
      .populate('owners', { email: 1, name: 1, _id: 0 })
      .exec();

    const newsImages = await Promise.all(
      newsData.map(({ _id }) => this.getImagePathsFromDynamoDb(_id)),
    );

    return newsData.map((news, index) => ({
      ...news.toJSON(),
      images: newsImages[index],
    }));
  }

  async findOne(id: string) {
    const [newsData] = await this.newsModel
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

    const newsImages = await this.getImagePathsFromDynamoDb(newsData._id);

    return {
      ...newsData,
      images: newsImages,
    };
  }
}
