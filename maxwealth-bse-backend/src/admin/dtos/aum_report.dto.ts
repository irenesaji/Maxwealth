import { IsString, IsDateString, ValidateIf } from 'class-validator';

export class AumReportDto {
  equity_value: number;
  equity_percentage: number;

  debt_value: number;
  debt_percentage: number;

  alternate_value: number;
  alternate_percentage: number;

  hybrid_value: number;
  hybrid_percentage: number;
}
