import { PartialType } from '@nestjs/swagger';
import { CreateCostInflationIndexDto } from './create-cii.dto';

export class UpdateCiiDto extends PartialType(CreateCostInflationIndexDto) {}
