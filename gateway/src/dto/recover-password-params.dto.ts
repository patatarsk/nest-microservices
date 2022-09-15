import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class RecoverPasswordParamsDto {
  @ApiProperty({
    description: 'email',
    example: 'email',
  })
  @IsEmail()
  email: string;
}
