import { UserOnboardingDetails } from 'src/onboarding/entities/user_onboarding_details.entity';
import { Users } from 'src/users/entities/users.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

@Entity('user_nominee_details')
export class UserNomineeDetails {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  date_of_birth: Date;

  @Column()
  relationship: string;

  @Column()
  allocation_percentage: number;

  @Column()
  pan: string;

  @Column()
  guardian_name: string;

  @Column()
  guardian_relationship: string;

  @Column()
  guardian_pan: string;

  @Column({ nullable: true, length: 100 })
  identity_proof_type: string;

  // @Column({ nullable: true, length: 100 })
  // guardian_identity_proof_type: string;

  @Column({ nullable: true })
  aadhaar_number: string;

  @Column({ nullable: true })
  passport_number: string;

  @Column({ nullable: true })
  driving_license_number: string;

  @Column({ nullable: true })
  email_address: string;

  @Column({ nullable: true })
  isd: string;

  @Column({ nullable: true })
  phone_number: string;

  @Column({ type: 'text', nullable: true })
  address_line_1: string;

  @Column({ type: 'text', nullable: true })
  address_line_2: string;

  @Column({ type: 'text', nullable: true })
  address_line_3: string;

  @Column({ nullable: true, length: 100 })
  address_city: string;

  @Column({ nullable: true, length: 100 })
  address_state: string;

  @Column({ nullable: true, length: 100 })
  address_country: string;

  @Column({ nullable: true, length: 10 })
  address_postal_code: string;

  @ManyToOne(() => Users)
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @Column()
  user_id: number;

  @Column()
  created_at: Date;

  @Column()
  guardian_dob: Date;

  @Column()
  updated_at: Date;

  @Column({ type: 'int', nullable: true })
  user_onboarding_detail_id: number;

  @ManyToOne(
    () => UserOnboardingDetails,
    (user_onboarding_detail) => user_onboarding_detail.user_nominee_details,
  )
  @JoinColumn({ name: 'user_onboarding_detail_id' })
  user_onboarding_detail: UserOnboardingDetails;
}
