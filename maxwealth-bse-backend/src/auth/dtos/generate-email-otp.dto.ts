import { IsNotEmpty } from 'class-validator';

export class GenerateEmailOtpDto {
  @IsNotEmpty()
  email: string;

  is_generate = true;
}
