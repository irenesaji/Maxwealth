import { IdentitfierDto } from './identifier.dto';

export class BankAccountDto {
  ifsc_code: string;
  bank_acc_num: string;
  bank_acc_type: string;
  account_owner: string;
  identifier: IdentitfierDto;
}
