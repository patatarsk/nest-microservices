import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern } from '@nestjs/microservices';
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

  @MessagePattern({ cmd: 'users_find_by_email' })
  findByEmail(email) {
    return this.usersService.findByEmail(email);
  }

  @MessagePattern({ cmd: 'users_create' })
  create(createUserData) {
    return this.usersService.create(createUserData);
  }

  @EventPattern({ cmd: 'users_update' })
  update({ id, updateUserDto }) {
    return this.usersService.update(id, updateUserDto);
  }

  @EventPattern({ cmd: 'users_remove' })
  remove(id) {
    return this.usersService.remove(id);
  }

  @EventPattern({ cmd: 'users_upload_avatar' })
  uploadAvatar({ username, filename }) {
    return this.usersService.saveAvatar(username, filename);
  }
}
