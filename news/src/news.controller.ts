import { NewsService } from './news.service';
import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern } from '@nestjs/microservices';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @MessagePattern({ cmd: 'news_create' })
  async create({ _id, createNewsDto }) {
    return this.newsService.create(createNewsDto, _id);
  }

  @MessagePattern({ cmd: 'news_find_all' })
  findAll() {
    return this.newsService.findAll();
  }

  @MessagePattern({ cmd: 'news_find_one' })
  findOne(id) {
    return this.newsService.findOne(id);
  }
}
