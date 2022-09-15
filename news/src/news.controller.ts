import { NewsService } from './news.service';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @MessagePattern({ cmd: 'news_create' })
  async create({ _id, createNewsDto, images }) {
    return await this.newsService.create(createNewsDto, _id, images);
  }

  @MessagePattern({ cmd: 'news_find_all' })
  findAll() {
    return this.newsService.findAll();
  }

  @MessagePattern({ cmd: 'news_find_one' })
  findOne({ id }) {
    return this.newsService.findOne(id);
  }
}
