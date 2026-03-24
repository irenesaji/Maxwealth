import { Users } from 'src/users/entities/users.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { TaxResidency } from './tax_residency.entity';
import { DematAccount } from './demat_account.entity';
import { UserBankDetails } from '../bank/entities/user_bank_details.entity';
import { UserAddressDetails } from '../address/entities/user_address_details.entity';
import { EmailAddress } from './email_addresses.entity';
import { PhoneNumber } from './phone_numbers.entity';
import { UserNomineeDetails } from '../nominee/entities/user-nominee-details.entity';
import { KycStatusDetail } from './kyc_status_details.entity';

@Entity('user_onboarding_details')
export class UserOnboardingDetails {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  is_kyc_compliant: boolean;

  @Column()
  pan: string;

  @Column({ nullable: true, default: null })
  full_name: string;

  @Column()
  date_of_birth: Date;

  @Column()
  father_name: string;

  @Column()
  mother_name: string;

  @Column()
  marital_status: string;

  @Column()
  gender: string;

  @Column()
  occupation: string;

  @Column()
  annual_income: string;

  @Column()
  nationality: string;

  @Column()
  signature_url: string;

  @Column()
  photo_url: string;

  @Column()
  pan_url: string;

  @Column()
  aadhaar_url: string;

  @Column()
  cheque_url: string;

  @Column()
  video_url: string;

  @Column()
  fp_esign_status: string;

  @Column()
  kyc_id: number;

  @Column()
  fp_photo_file_id: string;

  @Column()
  fp_video_file_id: string;

  @Column()
  fp_signature_file_id: string;

  @Column()
  aadhaar_number: string;

  @Column()
  verified_aadhaar_number: string;

  @Column()
  fp_esign_id: string;

  @Column()
  status: string;

  @Column()
  onboarding_status: string;

  @Column()
  lat: number;

  @Column()
  lng: number;

  @Column()
  identity_document_id: string;

  @Column()
  identity_document_status: string;

  @Column()
  fp_investor_id: string;

  @Column()
  fp_investment_account_old_id: number;

  @Column()
  fp_investment_account_id: string;

  @Column()
  fp_kyc_status: string;

  @Column()
  fp_kyc_reject_reasons: string;

  @Column()
  user_id: number;

  @OneToOne(() => Users)
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @Column()
  created_at: Date;

  @Column()
  updated_at: Date;

  @Column()
  rejected_at: Date;

  @Column()
  successful_at: Date;

  @Column({ type: 'varchar', length: 256, default: 'individual' })
  type: string;

  @Column({ type: 'varchar', length: 256, default: 'individual' })
  tax_status: string;

  @Column({ type: 'varchar', length: 256, nullable: true })
  guardian_name: string;

  @Column({ type: 'date', nullable: true })
  guardian_date_of_birth: Date;

  @Column({ type: 'varchar', length: 15, nullable: true })
  guardian_pan: string;

  @Column({ type: 'varchar', length: 15, nullable: true })
  country_of_birth: string;

  @Column({ type: 'varchar', length: 15, nullable: true })
  place_of_birth: string;

  @Column({ type: 'varchar', length: 60, nullable: true })
  source_of_wealth: string;

  @Column({ type: 'varchar', length: 60, nullable: true })
  pep_details: string;

  @Column({ type: 'varchar', length: 60, nullable: true })
  ip_address: string;

  @Column({ type: 'text', nullable: true })
  pdf_url: string;

  @Column({ type: 'text', nullable: true })
  esigned_pdf_url: string;

  @Column({ type: 'boolean', nullable: true })
  is_onboarding_complete: boolean;

  @Column()
  photo_buffer: string;

  @Column()
  pan_buffer: string;

  @Column()
  address_proof_buffer: string;

  @Column()
  cheque_buffer: string;

  @Column()
  aadhar_xml: string;

  @Column()
  pdf_buffers: string;

  @Column()
  signature_buffer: string;

  @Column()
  esign_html: string;

  @Column()
  esign_transaction_id: string;

  @Column()
  aof_document_url: string;

  @Column()
  is_political: boolean;

  @OneToMany(
    () => TaxResidency,
    (tax_residencies) => tax_residencies.user_onboarding_detail,
  )
  tax_residencies: TaxResidency[];

  @OneToMany(
    () => DematAccount,
    (demat_accounts) => demat_accounts.user_onboarding_details,
  )
  demat_accounts: DematAccount[];

  @OneToMany(
    () => UserBankDetails,
    (user_bank_details) => user_bank_details.user_onboarding_detail,
  )
  user_bank_details: UserBankDetails[];

  @OneToMany(
    () => UserAddressDetails,
    (user_address_details) => user_address_details.user_onboarding_detail,
  )
  user_address_details: UserAddressDetails[];

  @OneToMany(
    () => EmailAddress,
    (email_addresses) => email_addresses.user_onboarding_detail,
  )
  email_addresses: EmailAddress[];

  @OneToMany(
    () => PhoneNumber,
    (phone_numbers) => phone_numbers.user_onboarding_detail,
  )
  phone_numbers: PhoneNumber[];

  @OneToMany(
    () => UserNomineeDetails,
    (user_nominee_details) => user_nominee_details.user_onboarding_detail,
  )
  user_nominee_details: UserNomineeDetails[];

  @OneToMany(
    () => KycStatusDetail,
    (kycStatusDetails) => kycStatusDetails.user_onboarding_detail,
  )
  kyc_status_details: KycStatusDetail[];
}
