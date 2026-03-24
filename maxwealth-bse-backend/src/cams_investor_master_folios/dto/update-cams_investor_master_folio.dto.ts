import { PartialType } from '@nestjs/swagger';
import { CreateCamsInvestorMasterFolioDto } from './create-cams_investor_master_folio.dto';

export class UpdateCamsInvestorMasterFolioDto extends PartialType(
  CreateCamsInvestorMasterFolioDto,
) {}
