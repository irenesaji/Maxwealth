import { IsNotEmpty } from 'class-validator';

export class AddAadhaarNumberDto {
  @IsNotEmpty()
  aadhaar_number: string;
}
