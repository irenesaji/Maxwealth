import { IsNotEmpty } from 'class-validator';

export class TaxSaverInputsDto {
  @IsNotEmpty()
  investment_per_month: number;

  @IsNotEmpty()
  years: number;
}
