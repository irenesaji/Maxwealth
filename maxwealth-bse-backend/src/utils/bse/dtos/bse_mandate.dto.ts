import { BankAccountDTO } from 'src/transaction_baskets/dtos/bank_account.dto';

export class BseMandatesDTO {
  ucc: string;
  mem_code: string;
  status: string;
  src_acct: BankAccountDTO;
  dest_acct: BankAccountDTO;
  max_txn_amt: number;
  cur: string;
  start_date: string;
  valid_till: string;
  type: string;
  details: Record<string, any>;
  mode: string;
  debit_type: string;
  man_2fa: string;
  mandate_id: number;
}
