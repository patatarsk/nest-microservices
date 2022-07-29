import { Model } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findByEmail(email: string): Promise<UserDocument> {
    const foundUser = await this.userModel.findOne({ email }).exec();

    if (!foundUser) {
      throw new NotFoundException('User not found');
    }

    return foundUser;
  }

  async findOne(id: string): Promise<User> {
    const foundUser = await this.userModel.findById(id).exec();

    if (!foundUser) {
      throw new NotFoundException('User not found');
    }

    return foundUser;
  }

  async update(id: string, updateUserDto): Promise<void> {
    await this.userModel.updateOne({ _id: id }, updateUserDto).exec();
  }

  async remove(id: string): Promise<void> {
    await this.userModel.deleteOne({ _id: id }).exec();
  }

  async saveAvatar(username: string, filename: string): Promise<void> {
    await this.userModel
      .updateOne({ email: username }, { avatar: filename })
      .exec();
  }

  async autorshipStatistic(): Promise<any> {
    const autorshipStatistic = await this.userModel
      .aggregate([
        {
          $lookup: {
            localField: 'news',
            from: 'news',
            foreignField: '_id',
            as: 'newsdata',
          },
        },
        { $project: { email: 1, newsCount: { $size: '$newsdata' } } },
        { $sort: { newsCount: -1 } },
      ])
      .exec();

    return autorshipStatistic;
  }
}
