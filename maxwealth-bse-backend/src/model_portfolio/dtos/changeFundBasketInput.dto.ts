import { IsNotEmpty } from 'class-validator';

export class ChangeFundBasketInputDto {
  @IsNotEmpty()
  isin: string;

  @IsNotEmpty()
  amount: number;

  duration: number;

  @IsNotEmpty()
  is_onetime: boolean;
}
