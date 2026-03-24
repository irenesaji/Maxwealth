import { BankAccountDto } from './bank_account.dto';
import { FatcaDto } from './fatca.dto';
import { HolderDto } from './holder.dto';

export class UpdateUccDto {
  member_code: {
    memeber_id: string;
  };
  investor: {
    client_code: string;
  };
  holding_nature: string;
  tax_code: string;
  rdmp_idcw_pay_mode: string;
  is_client_physical: boolean;
  is_nomination_opted: boolean;
  nomination_auth_mode: string;
  comm_mode: string;
  onboarding: string;
  holder: {
    add: HolderDto[];
    delete: HolderDto[];
  };
  comm_addr: {
    address_line_1: string;
    address_line_2: string;
    address_line_3: string;
    postalcode: string;
  };
  bank_account: {
    add: BankAccountDto[];
    delete: BankAccountDto[];
  };
  fatca: {
    add: FatcaDto[];
    delete: FatcaDto[];
  };
}
