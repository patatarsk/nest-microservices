import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, IsMongoId } from 'class-validator';

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
    example: ['Owner 1 id', 'Owner 2 id'],
  })
  @IsArray()
  @IsMongoId({ each: true })
  owners: string[];
}
