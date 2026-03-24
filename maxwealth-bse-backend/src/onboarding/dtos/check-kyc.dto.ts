import { IsNotEmpty } from 'class-validator';

export class CheckKycDto {
  @IsNotEmpty()
  user_id: number;

  @IsNotEmpty()
  pan: string;

  is_compliant: boolean;
}
