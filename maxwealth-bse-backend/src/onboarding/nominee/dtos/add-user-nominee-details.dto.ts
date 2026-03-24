import { IsNotEmpty } from 'class-validator';

export class AddUserNomineeDetailsDto {
  @IsNotEmpty()
  user_id: number;

  user_onboarding_detail_id: number;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  date_of_birth: Date;

  @IsNotEmpty()
  relationship: string;

  @IsNotEmpty()
  allocation_percentage: number;

  identity_proof_type: string;

  pan: string;

  guardian_pan: string;

  guardian_name: string;

  guardian_relationship: string;

  aadhar_number: string;

  passport_number: string;

  driving_licence_number: string;

  email_address: string;

  isd: string;

  phone_number: string;

  address_line_1: string;

  address_line_2: string;

  address_line_3: string;

  address_city: string;

  address_state: string;

  address_country: string;

  address_postal_code: string;
}
