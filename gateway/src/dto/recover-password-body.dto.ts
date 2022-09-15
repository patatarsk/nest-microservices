import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RecoverPasswordBodyDto {
  @ApiProperty({
    description: 'password',
    example: '123123123',
  })
  @IsString()
  password: string;

  @ApiProperty({
    description: 'confirm password',
    example: '123123123',
  })
  @IsString()
  confirm: string;
}
