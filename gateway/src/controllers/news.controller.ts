import { ClientProxy } from '@nestjs/microservices';
import { GetParamsDto } from '../dto/get-params.dto';
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
import { CreateNewsDto } from '../dto/create-news.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
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
  create(@Body() createNewsDto: CreateNewsDto, @Request() req) {
    const { _id } = req.user;

    return this.newsService.send(
      { cmd: 'news_create' },
      { _id, createNewsDto },
    );
  }

  @Get()
  @ApiBearerAuth('access-token')
  findAll() {
    return this.newsService.send({ cmd: 'news_find_all' }, {});
  }

  @Get(':id')
  @ApiBearerAuth('access-token')
  findOne(@Param() getParamsDto: GetParamsDto) {
    const { id } = getParamsDto;

    return this.newsService.send({ cmd: 'news_find_one' }, id);
  }
}
