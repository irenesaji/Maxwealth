import { PartialType } from '@nestjs/mapped-types';
import { CreateCamDto } from './create-cam.dto';

export class UpdateCamDto extends PartialType(CreateCamDto) {}
