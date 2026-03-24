import { IsNotEmpty } from 'class-validator';

export class LongTermInputsDto {
  @IsNotEmpty()
  target_corpus: number;

  @IsNotEmpty()
  years: number;

  @IsNotEmpty()
  expected_returns: number;
}
