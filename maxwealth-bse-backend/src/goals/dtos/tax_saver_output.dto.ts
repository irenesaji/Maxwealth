import { IsNotEmpty } from 'class-validator';
import { InvestmentGraphDto } from './investment_graph.dto';

export class TaxSaverOutputDto {
  duration: number;
  invested: number;
  profit: number;
  total: number;
  assumed_return: number;
  investment_graph: InvestmentGraphDto[];
}
