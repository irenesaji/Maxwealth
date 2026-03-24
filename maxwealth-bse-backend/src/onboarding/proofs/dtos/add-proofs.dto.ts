import { IsNotEmpty } from 'class-validator';

export class AddProofsDto {
  @IsNotEmpty()
  user_id: number;

  @IsNotEmpty()
  type: string;

  @IsNotEmpty()
  document_type: string;

  front_document_url: string;

  back_document_url: string;

  proof_issue_date: Date;

  proof_expiry_date: Date;

  document_id_number: string;
}
