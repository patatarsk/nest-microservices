import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RecoverPasswordQueryDto {
  @ApiProperty({
    description: 'token',
    example: 'token',
  })
  @IsString()
  token: string;
}
