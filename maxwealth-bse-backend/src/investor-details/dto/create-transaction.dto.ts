import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsDateString,
  IsInt,
  IsJSON,
} from 'class-validator';

export class CreateTransactionDto {
  user_id: number;

  user_pan: string;

  object: string;

  is_processed: boolean;

  @IsNumber()
  units_left: number;

  @IsNotEmpty()
  @IsString()
  folio_number: string;

  @IsNotEmpty()
  @IsString()
  isin: string;

  @IsNotEmpty()
  @IsString()
  type: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsNumber()
  units: number;

  @IsNotEmpty()
  @IsDateString()
  traded_on: Date;

  @IsNotEmpty()
  @IsInt()
  traded_at: number;

  @IsOptional()
  @IsString()
  order?: string;

  @IsOptional()
  @IsString()
  corporate_action?: string;

  @IsOptional()
  @IsNumber()
  related_transaction_id?: number;

  @IsNotEmpty()
  @IsString()
  rta_order_reference: string;

  @IsNotEmpty()
  @IsString()
  usr_trx_no: string;

  @IsNotEmpty()
  @IsString()
  rta_product_code: string;

  @IsNotEmpty()
  @IsString()
  rta_investment_option: string;

  @IsNotEmpty()
  @IsString()
  rta_scheme_name: string;

  file_processed_id: number;
}
