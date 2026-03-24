import { RegisterSxpHolderDto } from './register_sxp_holder.dto';
import { DepositoryAccountDTO } from './depository_account.dto';
import { BankAccountDTO } from './bank_account.dto';
import { RegisterSxpNomineeDto } from './register_sxp_nominee.dto';
import { InvestorDTO } from './investor.dto';
import { OrderInfoDto } from './order_info.dto';

export class OrderNewPurchaseDTO {
  src: string;
  type: string;
  mem_ord_ref_id: string;
  investor: InvestorDTO;
  member: string;
  scheme: string;
  dst_scheme: string;
  amount: number;
  cur: string;
  is_units: boolean;
  all_units: boolean;
  is_fresh: boolean;
  folio: string;
  phys_or_demat: string;
  payment_ref_id: string;
  info: OrderInfoDto;
  holder: RegisterSxpHolderDto[];
  email: string;
  mobnum: string;
  exch_mandate_id: number;
  kyc_passed: boolean;
  depository_acct: DepositoryAccountDTO;
  bank_acct: BankAccountDTO;
  dpc: boolean;
  nomination: RegisterSxpNomineeDto[];
}
