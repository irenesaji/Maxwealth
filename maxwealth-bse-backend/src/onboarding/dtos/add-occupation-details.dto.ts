import { IsNotEmpty } from 'class-validator';

export class AddOccupationDetailsDto {
  @IsNotEmpty()
  user_id: number;

  @IsNotEmpty()
  occupation: string;

  @IsNotEmpty()
  annual_income: string;

  @IsNotEmpty()
  nationality: string;
}
