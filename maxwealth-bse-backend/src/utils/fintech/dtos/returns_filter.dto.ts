import {
  IsArray,
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsString,
  ValidateIf,
} from 'class-validator';

export class ReturnsFilterDto {
  @IsNotEmpty()
  mf_investment_account: string;

  @IsDateString()
  @ValidateIf((object, value) => value !== null)
  traded_on_to: Date;
}
