import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsMongoId, IsString } from 'class-validator';

export class CreateNewsDto {
  @ApiProperty({
    description: 'News title',
    example: 'Tittle 1',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'News text',
    example: 'Text 1',
  })
  @IsString()
  text: string;

  @ApiProperty({
    description: "News owners id's",
    type: 'array',
    items: {
      type: 'string',
    },
  })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.split(',') : value,
  )
  @IsArray()
  @IsMongoId({ each: true })
  owners: string[];

  @ApiProperty({
    description: 'Images',
    type: 'array',
    items: {
      type: 'file',
      items: {
        type: 'string',
        format: 'binary',
      },
    },
  })
  images: Express.Multer.File[];
}
