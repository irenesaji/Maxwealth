import { IsNotEmpty } from 'class-validator';
import { InvestmentGraphDto } from './investment_graph.dto';

export class LongTermOutputDto {
  monthly_investment: number;
  duration: number;
  total_corpus: number;
  investment_graph: InvestmentGraphDto[];
}
