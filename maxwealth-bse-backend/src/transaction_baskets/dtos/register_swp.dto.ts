import { BankAccountDTO } from './bank_account.dto';
import { DepositoryAccountDTO } from './depository_account.dto';
import { InfoDto } from './info.dto';
import { RegisterSxpHolderDto } from './register_sxp_holder.dto';
import { RegisterSxpNomineeDto } from './register_sxp_nominee.dto';

export class RegisterSwpDto {
  sxp_type: string;
  mem_ord_ref_id: string;
  ucc: string;
  member: string;
  src_scheme: string;
  dest_scheme: string;
  amc_code: string;
  amount: number;
  cur: string;
  src_folio: string;
  dest_folio: string;
  phys_or_demat: string;
  isunits: boolean;
  dpc: boolean;
  start_date: Date;
  end_date: Date;
  freq: string;
  txn_date: number;
  payment_ref_id: string;
  holder: RegisterSxpHolderDto[];
  info: InfoDto;
  depository_acct: DepositoryAccountDTO;
  bank_acct: BankAccountDTO;
  remark: string;
  email: string;
  mobnum: string;
  first_order_today: boolean;
  brokerage: number;
  ninstallments: number;
  nomination: RegisterSxpNomineeDto[];
}
