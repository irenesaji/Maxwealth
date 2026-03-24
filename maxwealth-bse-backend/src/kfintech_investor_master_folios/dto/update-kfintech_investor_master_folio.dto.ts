import { PartialType } from '@nestjs/swagger';
import { CreateKfintechInvestorMasterFolioDto } from './create-kfintech_investor_master_folio.dto';

export class UpdateKfintechInvestorMasterFolioDto extends PartialType(
  CreateKfintechInvestorMasterFolioDto,
) {}
