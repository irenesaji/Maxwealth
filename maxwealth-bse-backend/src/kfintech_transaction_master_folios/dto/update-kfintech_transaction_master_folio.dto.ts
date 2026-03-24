import { PartialType } from '@nestjs/swagger';
import { CreateKfintechTransactionMasterFolioDto } from './create-kfintech_transaction_master_folio.dto';

export class UpdateKfintechTransactionMasterFolioDto extends PartialType(
  CreateKfintechTransactionMasterFolioDto,
) {}
