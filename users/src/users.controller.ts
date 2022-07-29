import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { UsersService } from './users.service';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern({ cmd: 'users_find_all' })
  findAll() {
    return this.usersService.findAll();
  }

  @MessagePattern({ cmd: 'users_autorship_statistic' })
  autorshipStatistic() {
    return this.usersService.autorshipStatistic();
  }

  @MessagePattern({ cmd: 'users_find_one' })
  findOne(id) {
    return this.usersService.findOne(id);
  }

  @MessagePattern({ cmd: 'users_update' })
  update(id, updateUserData) {
    return this.usersService.update(id, updateUserData);
  }

  @MessagePattern({ cmd: 'users_remove' })
  remove(id) {
    return this.usersService.remove(id);
  }

  @MessagePattern({ cmd: 'users_upload_avatar' })
  uploadAvatar(username, filename) {
    return this.usersService.saveAvatar(username, filename);
  }
}
