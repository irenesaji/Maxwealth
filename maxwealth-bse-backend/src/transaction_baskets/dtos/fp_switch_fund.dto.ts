import { CreateTransactionBasketItemDTO } from './create_transaction_basket_items.dto';

export class FpSwitchFundDTO {
  switch_out_scheme: string;
  switch_in_scheme: string;
  folio_number: string;
  amount: number;
  user_ip: number;
  server_ip: number;
  mf_investment_account: string;
  units: number;
}
