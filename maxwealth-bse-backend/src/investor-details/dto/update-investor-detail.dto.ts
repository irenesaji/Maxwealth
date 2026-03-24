import { PartialType } from '@nestjs/swagger';
import { CreateInvestorDetailDto } from './create-investor-detail.dto';

export class UpdateInvestorDetailDto extends PartialType(
  CreateInvestorDetailDto,
) {}
