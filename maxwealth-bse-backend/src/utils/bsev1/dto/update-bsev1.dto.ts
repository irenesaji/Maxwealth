import { PartialType } from '@nestjs/swagger';
import { CreateBsev1Dto } from './create-bsev1.dto';

export class UpdateBsev1Dto extends PartialType(CreateBsev1Dto) {}
