import { NewsService } from './news.service';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @MessagePattern({ cmd: 'news_create' })
  async create(@Payload() { _id, createNewsDto, images }) {
    return await this.newsService.create(createNewsDto, _id, images);
  }

  @MessagePattern({ cmd: 'news_find_all' })
  findAll() {
    return this.newsService.findAll();
  }

  @MessagePattern({ cmd: 'news_find_one' })
  findOne(@Payload() id) {
    return this.newsService.findOne(id);
  }
}
