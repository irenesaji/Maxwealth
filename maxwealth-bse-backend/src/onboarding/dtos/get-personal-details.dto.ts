import { IsNotEmpty } from 'class-validator';

export class GetPersonalDetailsDto {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  user_id: number;

  @IsNotEmpty()
  father_name: string;

  @IsNotEmpty()
  mother_name: string;

  @IsNotEmpty()
  marital_status: string;

  @IsNotEmpty()
  gender: string;

  kyc_id: number;

  is_kyc_compliant: boolean;
}
