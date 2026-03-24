import { IsNotEmpty } from 'class-validator';
export class GetProofsDto {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  user_id: number;

  @IsNotEmpty()
  type: string;

  @IsNotEmpty()
  document_type: string;

  front_document_url: string;

  back_document_url: string;

  document_id_number: string;

  fp_front_document_url: string;

  fp_back_document_url: string;

  front_document_path: string;

  back_document_path: string;

  fp_front_side_file_id: string;

  fp_back_side_file_id: string;

  proof_issue_date: Date;

  proof_expiry_date: Date;

  created_at: Date;

  updated_at: Date;

  kyc_id: number;

  is_kyc_compliant: boolean;
}
