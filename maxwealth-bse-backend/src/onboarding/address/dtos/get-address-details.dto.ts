import { IsNotEmpty } from 'class-validator';

export class GetAddressDetailsDto {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  user_id: number;

  @IsNotEmpty()
  pincode: string;

  @IsNotEmpty()
  line_1: string;

  line_2: string;

  line_3: string;

  @IsNotEmpty()
  state: string;

  @IsNotEmpty()
  city: string;

  kyc_id: number;

  is_kyc_compliant: boolean;
}
