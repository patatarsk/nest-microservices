import { FilesInterceptor } from '@nestjs/platform-express';
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
import { ApiConsumes } from '@nestjs/swagger';
import { UseInterceptors } from '@nestjs/common';
import { UploadedFiles } from '@nestjs/common';

@Controller('news')
@UseGuards(JwtAuthGuard)
export class NewsController {
  constructor(@Inject('SQS_SERVICE') private sqsService: ClientProxy) {}

  @Post()
  @ApiBearerAuth('access-token')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('images'))
  create(
    @Body() createNewsDto: CreateNewsDto,
    @Request() req,
    @UploadedFiles()
    files: { images?: Express.Multer.File[] },
  ) {
    const { _id } = req.user;

    return this.sqsService.send(
      { cmd: 'news_create' },
      { _id, createNewsDto, images: files },
    );
  }

  @Get()
  @ApiBearerAuth('access-token')
  findAll() {
    return this.sqsService.send({ cmd: 'news_find_all' }, {});
  }

  @Get(':id')
  @ApiBearerAuth('access-token')
  findOne(@Param() getParamsDto: GetParamsDto) {
    const { id } = getParamsDto;

    return this.sqsService.send({ cmd: 'news_find_one' }, { id });
  }
}
