import { IsNotEmpty } from 'class-validator';
import { InvestmentGraphDto } from './investment_graph.dto';

export class RetirementCorpusOutputDto {
  monthly_investment: number;
  lumpsum: number;
  duration: number;
  total_corpus: number;
  investment_graph: InvestmentGraphDto[];
}
