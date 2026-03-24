import { IsNotEmpty, IsOptional } from 'class-validator';

export class GenerateOtpDto {
  @IsNotEmpty()
  mobile: string;

  @IsOptional()
  is_generate?: boolean = true;
}
