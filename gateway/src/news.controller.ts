import { lastValueFrom } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import { GetParamsDto } from './dto/get-params.dto';
import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  Param,
  Inject,
} from '@nestjs/common';
import { CreateNewsDto } from './dto/create-news.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('news')
@UseGuards(JwtAuthGuard)
export class NewsController {
  constructor(
    @Inject('USERS_SERVICE') private usersService: ClientProxy,
    @Inject('NEWS_SERVICE') private newsService: ClientProxy,
  ) {}

  @Post()
  @ApiBearerAuth('access-token')
  async create(@Body() createNewsDto: CreateNewsDto, @Request() req) {
    const { _id } = req.user;

    const news = await lastValueFrom(
      this.newsService.send({ cmd: 'news_create' }, { _id, createNewsDto }),
    );

    this.usersService.emit(
      { cmd: 'users_update_with_news' },
      { ids: news.owners, newsId: news._id },
    );

    return news;
  }

  @Get()
  @ApiBearerAuth('access-token')
  async findAll() {
    return await lastValueFrom(
      this.newsService.send({ cmd: 'news_find_all' }, {}),
    );
  }

  @Get(':id')
  @ApiBearerAuth('access-token')
  async findOne(@Param() getParamsDto: GetParamsDto) {
    const { id } = getParamsDto;

    return await lastValueFrom(
      this.newsService.send({ cmd: 'news_find_one' }, id),
    );
  }
}
