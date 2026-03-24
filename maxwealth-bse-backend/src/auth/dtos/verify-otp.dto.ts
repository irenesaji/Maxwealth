import { IsNotEmpty } from 'class-validator';

export class VerifyOtpDto {
  @IsNotEmpty()
  mobile: string;

  @IsNotEmpty()
  otp: number;

  fcmToken: string;
}
