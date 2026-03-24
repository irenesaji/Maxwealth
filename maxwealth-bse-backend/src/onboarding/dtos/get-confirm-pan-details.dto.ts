import { IsNotEmpty } from 'class-validator';

export class GetConfirmPanDetailsDto {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  user_id: number;

  @IsNotEmpty()
  pan: string;

  @IsNotEmpty()
  full_name: string;

  @IsNotEmpty()
  date_of_birth: Date;

  kyc_id: number;

  is_kyc_compliant: boolean;

  aadhar_number: string;
}
