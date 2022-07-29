import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';

export class GetParamsDto {
  @ApiProperty({
    description: 'News id',
    example: 'test id',
  })
  @IsMongoId()
  id: string;
}
