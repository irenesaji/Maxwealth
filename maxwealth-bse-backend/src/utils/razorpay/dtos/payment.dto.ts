import { IsNotEmpty } from 'class-validator';
import { UserBankDetails } from 'src/onboarding/bank/entities/user_bank_details.entity';
import { Users } from 'src/users/entities/users.entity';
export class PaymentDto {
  @IsNotEmpty()
  amc_order_ids: number[];

  @IsNotEmpty()
  method: string;

  @IsNotEmpty()
  payment_postback_url: string;

  @IsNotEmpty()
  bank_account: UserBankDetails;
}
