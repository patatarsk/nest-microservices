import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { UsersService } from './users.service';

@Controller('users')
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
  findOne(@Payload() id) {
    return this.usersService.findOne(id);
  }

  @MessagePattern({ cmd: 'users_find_by_email' })
  findByEmail(@Payload() email) {
    return this.usersService.findByEmail(email);
  }

  @MessagePattern({ cmd: 'users_create' })
  create(@Payload() createUserData) {
    return this.usersService.create(createUserData);
  }

  @EventPattern({ cmd: 'users_update' })
  update(@Payload() { id, updateUserDto }) {
    return this.usersService.update(id, updateUserDto);
  }

  @EventPattern({ cmd: 'users_remove' })
  remove(@Payload() id) {
    return this.usersService.remove(id);
  }

  @EventPattern({ cmd: 'users_upload_avatar' })
  uploadAvatar(@Payload() { username, filename }) {
    return this.usersService.saveAvatar(username, filename);
  }
}
