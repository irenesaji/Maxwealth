import { IsNotEmpty } from 'class-validator';

export class GetSignatureDto {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  user_id: number;

  @IsNotEmpty()
  signature_url: string;

  @IsNotEmpty()
  fp_signature_file_id: string;

  kyc_id: number;

  is_kyc_compliant: boolean;
}
