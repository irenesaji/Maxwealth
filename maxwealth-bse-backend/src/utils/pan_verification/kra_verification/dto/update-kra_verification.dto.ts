import { PartialType } from '@nestjs/mapped-types';
import { CreateKraVerificationDto } from './create-kra_verification.dto';

export class UpdateKraVerificationDto extends PartialType(
  CreateKraVerificationDto,
) {}
