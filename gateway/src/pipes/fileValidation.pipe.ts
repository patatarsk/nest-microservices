import {
  ArgumentMetadata,
  Injectable,
  PipeTransform,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class ValidateFile implements PipeTransform {
  transform(
    file: Express.Multer.File,
    metadata: ArgumentMetadata,
  ): Express.Multer.File {
    if (!file) {
      throw new BadRequestException('No file');
    }

    if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|jfif)$/)) {
      throw new BadRequestException('Invalid file type');
    }

    return file;
  }
}
