import { IsNotEmpty } from 'class-validator';

export class CheckKycResponseDto {
  user_id: number;
  user_onboarding_detail_id: number;
  pan: string;
  name: string;
  status: boolean;
  kyc_status: string;
  pan_details: any;
}
