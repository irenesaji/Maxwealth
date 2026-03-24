import { IsNotEmpty } from 'class-validator';
import { Mandates } from 'src/mandates/entities/mandates.entity';

export class GetUserBankDetailsDto {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  account_holder_name: string;

  @IsNotEmpty()
  account_number: string;

  @IsNotEmpty()
  ifsc_code: string;

  fp_bank_id: string;

  old_fp_bank_id: number;

  proof: string;

  bank_name: string;

  logo_url: string;

  is_penny_drop_success: boolean;

  is_penny_drop_attempted: boolean;

  is_primary: boolean;

  penny_drop_request_id: string;

  @IsNotEmpty()
  user_id: number;

  kyc_id: number;

  is_kyc_compliant: boolean;

  mandates: Mandates[];
}
