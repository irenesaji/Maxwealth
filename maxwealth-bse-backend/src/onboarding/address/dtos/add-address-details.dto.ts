import { IsNotEmpty } from 'class-validator';

export class AddAddressDetailsDto {
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
}
