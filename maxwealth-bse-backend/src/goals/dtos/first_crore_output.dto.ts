import { IsNotEmpty } from 'class-validator';
import { InvestmentGraphDto } from './investment_graph.dto';

export class FirstCroreOutputDto {
  crore_duration: number;

  investment_graph: InvestmentGraphDto[];
}
