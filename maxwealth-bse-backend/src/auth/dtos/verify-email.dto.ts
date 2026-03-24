import { IsNotEmpty } from 'class-validator';

export class VerifyEmailDto {
  @IsNotEmpty()
  user_id: number;

  @IsNotEmpty()
  otp: number;

  fcmToken: string;
}
