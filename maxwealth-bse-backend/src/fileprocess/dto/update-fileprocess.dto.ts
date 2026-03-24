import { PartialType } from '@nestjs/swagger';
import { CreateFileprocessDto } from './create-fileprocess.dto';

export class UpdateFileprocessDto extends PartialType(CreateFileprocessDto) {}
