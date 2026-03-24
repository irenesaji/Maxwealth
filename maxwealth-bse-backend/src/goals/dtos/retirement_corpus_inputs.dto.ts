import { IsNotEmpty } from 'class-validator';

export class RetirementCorpusInputsDto {
  @IsNotEmpty()
  current_monthly_expense: number;

  @IsNotEmpty()
  age: number;

  @IsNotEmpty()
  retire_at_age: number;

  @IsNotEmpty()
  life_expectancy: number;

  @IsNotEmpty()
  existing_investments: number;

  @IsNotEmpty()
  yearly_rate_of_expense_increase: number;

  @IsNotEmpty()
  expected_rate_existing_investment: number;

  @IsNotEmpty()
  expected_inflation: number;

  @IsNotEmpty()
  expected_rate_new_investment: number;

  @IsNotEmpty()
  retirement_monthly_expense: number;
}
