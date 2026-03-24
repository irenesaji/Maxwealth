import { IsNotEmpty } from 'class-validator';

export class ConfirmPanDetailsDto {
  @IsNotEmpty()
  user_id: number;

  @IsNotEmpty()
  pan: string;

  @IsNotEmpty()
  aadhar_number: string;

  @IsNotEmpty()
  full_name: string;

  @IsNotEmpty()
  date_of_birth: Date;
}
