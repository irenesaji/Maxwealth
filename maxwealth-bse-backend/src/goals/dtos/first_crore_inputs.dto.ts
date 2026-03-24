import { IsNotEmpty } from 'class-validator';

export class FirstCroreInputsDto {
  @IsNotEmpty()
  investment_per_month: number;

  @IsNotEmpty()
  expected_returns: number;

  @IsNotEmpty()
  increase_investment_yearly_percent: number;
}
