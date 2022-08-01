import { IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ParamsUserDto {
  @ApiProperty({
    description: 'Id',
  })
  @IsMongoId()
  id: string;
}
