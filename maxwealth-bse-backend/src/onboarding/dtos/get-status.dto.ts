import { IsNotEmpty } from 'class-validator';

export class GetStatusDto {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  user_id: number;

  status: string;

  onboarding_status: string;

  fp_investor_id: string;

  fp_investment_account_old_id: number;

  fp_investment_account_id: string;

  fp_kyc_status: string;

  fp_kyc_reject_reasons: string;

  fp_esign_id: string;

  fp_esign_status: string;

  kyc_id: number;

  is_kyc_compliant: boolean;

  is_investment_done: boolean;
}
