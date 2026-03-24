import { IsOptional, IsString, IsDateString } from 'class-validator';

export class GetAumReportDto {
  @IsOptional()
  @IsString()
  partner?: string;

  @IsOptional()
  @IsDateString()
  traded_on_from?: Date;

  @IsOptional()
  @IsDateString()
  traded_on_to?: Date;
}
