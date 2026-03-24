import { IsNotEmpty } from 'class-validator';

export class GetOccupationDetailsDto {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  user_id: number;

  @IsNotEmpty()
  occupation: string;

  @IsNotEmpty()
  annual_income: string;

  @IsNotEmpty()
  nationality: string;

  kyc_id: number;

  is_kyc_compliant: boolean;
}
