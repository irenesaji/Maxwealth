import { IsNumber, IsOptional, IsDate } from 'class-validator';

export class CreateSourceDto {
  @IsNumber()
  transaction_report_id: number;

  @IsOptional()
  @IsNumber()
  gain?: number;

  @IsOptional()
  @IsNumber()
  units?: number;

  @IsOptional()
  @IsNumber()
  days_held?: number;

  @IsOptional()
  @IsNumber()
  purchased_at?: number;

  @IsOptional()
  @IsDate()
  purchased_on?: Date;
}
