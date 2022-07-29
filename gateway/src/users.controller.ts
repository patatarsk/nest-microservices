import { ValidateFile } from './pipes/fileValidation.pipe';
import { FileUploadDto } from './dto/file-upload.dto';
import { ParamsUserDto } from './dto/params-user.dto';
import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Post,
  UseInterceptors,
  UploadedFile,
  Request,
  Inject,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { ClientProxy } from '@nestjs/microservices';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(@Inject('USERS_SERVICE') private usersService: ClientProxy) {}

  @Get()
  @ApiBearerAuth('access-token')
  async findAll() {
    return this.usersService.send({ cmd: 'users_find_all' }, {});
  }

  @Get('/autorship')
  @ApiBearerAuth('access-token')
  autorshipStatistic() {
    return this.usersService.send({ cmd: 'users_autorship_statistic' }, {});
  }

  @Get(':id')
  @ApiBearerAuth('access-token')
  findOne(@Param() ParamsUserDto: ParamsUserDto) {
    const { id } = ParamsUserDto;

    return this.usersService.send({ cmd: 'users_find_one' }, id);
  }

  @Patch(':id')
  @ApiBearerAuth('access-token')
  update(
    @Param() paramsUserDto: ParamsUserDto,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const { id } = paramsUserDto;

    return this.usersService.emit(
      { cmd: 'users_update' },
      { id, updateUserDto },
    );
  }

  @Delete(':id')
  @ApiBearerAuth('access-token')
  remove(@Param() ParamsUserDto: ParamsUserDto) {
    const { id } = ParamsUserDto;

    return this.usersService.emit({ cmd: 'users_remove' }, id);
  }

  @Post('/upload/avatar')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './avatars',
      }),
    }),
  )
  @ApiBearerAuth('access-token')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'A new avatar for the user',
    type: FileUploadDto,
  })
  uploadAvatar(
    @UploadedFile(new ValidateFile()) file: Express.Multer.File,
    @Request() req,
  ) {
    const { username } = req.user;

    return this.usersService.emit(
      { cmd: 'users_upload_avatar' },
      { username, filename: file.filename },
    );
  }
}
