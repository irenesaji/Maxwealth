import { IsNotEmpty } from 'class-validator';

export class AddUserBankDetailsDto {
  @IsNotEmpty()
  account_holder_name: string;

  @IsNotEmpty()
  account_number: string;

  @IsNotEmpty()
  ifsc_code: string;

  proof: string;

  @IsNotEmpty()
  bank_name: string;

  is_penny_drop_success: boolean;

  is_penny_drop_attempted: boolean;

  is_primary: boolean;

  penny_drop_request_id: string;

  @IsNotEmpty()
  user_id: number;

  vpa_id: string;
}
