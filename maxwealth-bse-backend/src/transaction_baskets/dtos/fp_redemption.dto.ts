import { CreateTransactionBasketItemDTO } from './create_transaction_basket_items.dto';

export class FpRedemptionDTO {
  scheme: string;
  folio_number: string;
  amount: number;
  user_ip: number;
  server_ip: number;
  mf_investment_account: string;
  units: number;
  // redemption_mode:string;
}
