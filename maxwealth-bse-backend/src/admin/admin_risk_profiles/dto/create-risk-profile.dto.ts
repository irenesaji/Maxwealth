import {
  IsString,
  IsBoolean,
  IsNumber,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsInt,
} from 'class-validator';

export class CreateRiskProfileDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsNotEmpty()
  low: string;

  @IsNumber()
  @IsNotEmpty()
  high: string;

  @IsBoolean()
  @IsNotEmpty()
  is_active: boolean;

  @IsString()
  @IsNotEmpty()
  display_equity_allocation: string;

  @IsNumber()
  @IsNotEmpty()
  min_equity_allocation: string;

  @IsNumber()
  @IsNotEmpty()
  max_equity_allocation: string;

  @IsString()
  @IsNotEmpty()
  display_debt_allocation: string;

  @IsNumber()
  @IsNotEmpty()
  min_debt_allocation: string;

  @IsNumber()
  @IsNotEmpty()
  max_debt_allocation: string;

  @IsString()
  @IsNotEmpty()
  display_liquid_allocation: string;

  @IsNumber()
  @IsNotEmpty()
  min_liquid_allocation: string;

  @IsNumber()
  @IsNotEmpty()
  max_liquid_allocation: string;

  @IsOptional()
  model_portfolio_id?: number;
}
