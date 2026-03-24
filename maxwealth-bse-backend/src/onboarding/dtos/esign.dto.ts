import { IsNotEmpty } from 'class-validator';

export class EsignDto {
  @IsNotEmpty()
  esign_id: string;

  @IsNotEmpty()
  user_id: number;

  @IsNotEmpty()
  redirect_url: string;

  @IsNotEmpty()
  esign_status: string;

  kyc_id: number;

  is_kyc_compliant: boolean;
}
