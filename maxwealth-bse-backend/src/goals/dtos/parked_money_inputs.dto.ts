import { IsNotEmpty } from 'class-validator';

export class ParkedMoneyInputsDto {
  @IsNotEmpty()
  amount: number;

  @IsNotEmpty()
  is_monthly: boolean;
}
