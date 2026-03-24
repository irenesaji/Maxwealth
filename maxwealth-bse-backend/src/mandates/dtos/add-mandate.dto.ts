import { IsNotEmpty } from 'class-validator';

export class AddMandateDto {
  @IsNotEmpty()
  bank_id: number;

  @IsNotEmpty()
  mandate_limit: number;

  mandate_type: string;
}
