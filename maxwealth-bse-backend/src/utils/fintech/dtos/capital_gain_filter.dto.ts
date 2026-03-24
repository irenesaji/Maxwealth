import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsDate,
  IsArray,
  IsDateString,
} from 'class-validator';

export class CapitalGainFilterDto {
  @IsNotEmpty()
  mf_investment_account: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  folios?: string[];

  @IsOptional()
  @IsString()
  scheme?: string;

  @IsOptional()
  @IsDateString()
  traded_on_from?: Date;

  @IsOptional()
  @IsDateString()
  traded_on_to?: Date;
}
