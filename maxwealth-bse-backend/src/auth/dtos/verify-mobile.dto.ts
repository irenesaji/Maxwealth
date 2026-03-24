import { IsNotEmpty } from 'class-validator';

export class VerifyMobileDto {
  @IsNotEmpty()
  user_id: number;

  @IsNotEmpty()
  otp: number;

  fcmToken: string;
}
