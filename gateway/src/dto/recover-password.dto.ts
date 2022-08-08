import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class RecoverPasswordDto {
  @ApiProperty({
    description: 'username',
    example: 'test@gmail.com',
  })
  @IsEmail()
  username: string;
}
