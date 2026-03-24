import { PartialType } from '@nestjs/mapped-types';
import { CreateKarvyDto } from './create-karvy.dto';

export class UpdateKarvyDto extends PartialType(CreateKarvyDto) {}
