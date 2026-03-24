import { IsNotEmpty } from 'class-validator';

export class GetVideoDto {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  user_id: number;

  @IsNotEmpty()
  video_url: string;

  @IsNotEmpty()
  fp_video_file_id: string;

  kyc_id: number;

  is_kyc_compliant: boolean;
}
