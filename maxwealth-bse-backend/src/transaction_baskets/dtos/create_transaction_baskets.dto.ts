import { IsOptional } from 'class-validator';
import { CreateTransactionBasketItemDTO } from './create_transaction_basket_items.dto';

export class CreateTransactionBasketDTO {
  @IsOptional()
  user_id?: number;

  is_smart_sip: boolean;
  goal_id: number;
  total_amount: number;
  model_portfolio_id: number;
  is_redemption_full: boolean;
  is_euin: boolean;
  // consent_email: string;
  // isd_code: string;
  // consent_mobile: string;
  status: string;
  @IsOptional()
  transaction_basket_items?: CreateTransactionBasketItemDTO[];
}
