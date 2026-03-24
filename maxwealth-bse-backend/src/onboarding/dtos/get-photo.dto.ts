import { IsNotEmpty } from 'class-validator';

export class GetPhotoDto {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  user_id: number;

  @IsNotEmpty()
  photo_url: string;

  @IsNotEmpty()
  fp_photo_file_id: string;

  photo_buffer: string;

  kyc_id: number;

  is_kyc_compliant: boolean;
}
