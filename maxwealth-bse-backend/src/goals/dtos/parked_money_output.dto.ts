import { IsNotEmpty } from 'class-validator';
import { InvestmentGraphDto } from './investment_graph.dto';

export class ParkedMoneyOutputDto {
  monthly_investment: number;
  total_investment: number;
  gain: number;
  duration: number;
  total_corpus: number;
  investment_graph: InvestmentGraphDto[];
}
