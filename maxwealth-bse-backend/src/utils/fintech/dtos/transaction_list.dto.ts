import { IsString, IsDateString, ValidateIf } from 'class-validator';

export class TransactionListDto {
  @IsString()
  @ValidateIf((object, value) => value !== null)
  partner: string;

  @IsString()
  @ValidateIf((object, value) => value !== null)
  primary_investor_name: string;

  @IsString()
  @ValidateIf((object, value) => value !== null)
  folio_number: string;

  @IsString()
  @ValidateIf((object, value) => value !== null)
  pan_number: string;

  @IsDateString()
  @ValidateIf((object, value) => value !== null)
  traded_on_from: Date;

  @IsDateString()
  @ValidateIf((object, value) => value !== null)
  traded_on_to: Date;
}
