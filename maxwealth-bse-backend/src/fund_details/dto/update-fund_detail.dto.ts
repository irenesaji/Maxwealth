import { PartialType } from '@nestjs/swagger';
import { CreateFundDetailDto } from './create-fund_detail.dto';

export class UpdateFundDetailDto extends PartialType(CreateFundDetailDto) {}
