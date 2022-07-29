import { ApiProperty } from '@nestjs/swagger';
export class AuthUserDto {
  @ApiProperty({
    description: 'Users email',
    example: 'test@gmail.com',
  })
  username: string;

  @ApiProperty({
    description: 'Users password',
    example: '123123123',
  })
  password: string;
}
