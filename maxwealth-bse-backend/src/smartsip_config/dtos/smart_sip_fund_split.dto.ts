import { IsNotEmpty } from 'class-validator';

export class SmartSipFundSplitDto {
  isin: string;
  amount: number;
  user_id: number;
  folio_number: string;
  duration: number;
  instalment_day: number;
}
