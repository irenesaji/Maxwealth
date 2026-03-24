import { PartialType } from '@nestjs/mapped-types';
import { CreateFintupleDto } from './create-fintuple.dto';

export class UpdateFintupleDto extends PartialType(CreateFintupleDto) {}
