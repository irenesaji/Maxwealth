import { IsNotEmpty } from 'class-validator';

export class EmergencyFundInputsDto {
  @IsNotEmpty()
  monthly_income: number;

  @IsNotEmpty()
  monthly_expense: number;

  @IsNotEmpty()
  existing_investment: number;

  @IsNotEmpty()
  expected_return: number;
}
