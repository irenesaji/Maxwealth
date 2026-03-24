import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Users } from '../../users/entities/users.entity';
import { UserOnboardingDetails } from './user_onboarding_details.entity';
import { SignzyKycObject } from './signzy_kyc_object.entity';

@Entity('kyc_status_details')
export class KycStatusDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column()
  user_onboarding_detail_id: number;

  @Column()
  signzy_kyc_object_id: number;

  @ManyToOne(() => Users)
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @ManyToOne(() => UserOnboardingDetails)
  @JoinColumn({ name: 'user_onboarding_detail_id' })
  user_onboarding_detail: UserOnboardingDetails;

  @ManyToOne(() => SignzyKycObject)
  @JoinColumn({ name: 'signzy_kyc_object_id' })
  signzy_kyc_object: SignzyKycObject;

  @Column({ type: 'tinyint', default: 0 })
  pan: boolean;

  @Column({ type: 'tinyint', default: 0 })
  full_name: boolean;

  @Column({ type: 'tinyint', default: 0 })
  date_of_birth: boolean;

  @Column({ type: 'tinyint', default: 0 })
  father_name: boolean;

  @Column({ type: 'tinyint', default: 0 })
  mother_name: boolean;

  @Column({ type: 'tinyint', default: 0 })
  nominee: boolean;

  @Column({ type: 'tinyint', default: 0 })
  marital_status: boolean;

  @Column({ type: 'tinyint', default: 0 })
  gender: boolean;

  @Column({ type: 'tinyint', default: 0 })
  occupation: boolean;

  @Column({ type: 'tinyint', default: 0 })
  annual_income: boolean;

  @Column({ type: 'tinyint', default: 0 })
  nationality: boolean;

  @Column({ type: 'tinyint', default: 0 })
  bank_account_details: boolean;

  @Column({ type: 'tinyint', default: 0 })
  self_photo: boolean;

  @Column({ type: 'tinyint', default: 0 })
  pan_upload: boolean;

  @Column({ type: 'tinyint', default: 0 })
  poa_aadhaar_digilocker: boolean;

  @Column({ type: 'tinyint', default: 0 })
  address_details: boolean;

  @Column({ type: 'tinyint', default: 0 })
  signature_upload: boolean;

  @Column({ type: 'tinyint', default: 0 })
  aadhaar_esign: boolean;

  @Column({ type: 'tinyint', default: 0 })
  signzy_poi_poa_link_generated: boolean;

  @Column({ type: 'tinyint', default: 0 })
  signzy_poi_poa_updated: boolean;

  @Column({ type: 'tinyint', default: 0 })
  signzy_bank_updated: boolean;

  @Column({ type: 'tinyint', default: 0 })
  signzy_kyc_data_updated: boolean;

  @Column({ type: 'tinyint', default: 0 })
  signzy_fatca_updated: boolean;

  @Column({ type: 'tinyint', default: 0 })
  signzy_forensics_updated: boolean;

  @Column({ type: 'tinyint', default: 0 })
  signzy_signature_updated: boolean;

  @Column({ type: 'tinyint', default: 0 })
  signzy_photo_updated: boolean;

  @Column({ type: 'tinyint', default: 0 })
  signzy_generate_pdf: boolean;

  @Column({ type: 'tinyint', default: 0 })
  signzy_generate_aadhar_esign_url: boolean;

  @Column({ type: 'tinyint', default: 0 })
  signzy_save_aadhar_esign: boolean;

  @Column({ type: 'varchar', length: 100 })
  status: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
