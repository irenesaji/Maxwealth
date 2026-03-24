import { Mandates } from 'src/mandates/entities/mandates.entity';
import { UserOnboardingDetails } from 'src/onboarding/entities/user_onboarding_details.entity';
import { Users } from 'src/users/entities/users.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity('user_bank_details')
export class UserBankDetails {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  account_holder_name: string;

  @Column({ nullable: true, default: null })
  account_number: string;

  @Column({ nullable: true, default: null })
  ifsc_code: string;

  @Column()
  proof: string;

  @Column()
  bank_name: string;

  @Column()
  is_penny_drop_success: boolean;

  @Column()
  is_penny_drop_attempted: boolean;

  @Column()
  is_primary: boolean;

  @Column()
  penny_drop_request_id: string;

  @Column()
  vpa_id: string;

  @Column()
  user_id: number;

  @Column()
  account_type: string;

  @Column()
  branch_name: string;

  @Column()
  bank_city: string;

  @Column()
  bank_state: string;

  @ManyToOne(() => Users)
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @Column({ type: 'int', nullable: true })
  user_onboarding_detail_id: number;

  @ManyToOne(
    () => UserOnboardingDetails,
    (user_onboarding_detail) => user_onboarding_detail.user_bank_details,
  )
  @JoinColumn({ name: 'user_onboarding_detail_id' })
  user_onboarding_detail: UserOnboardingDetails;

  @Column()
  created_at: Date;

  @Column()
  updated_at: Date;

  @OneToMany((type) => Mandates, (mandates) => mandates.user_bank_detail)
  @JoinColumn({ name: 'bank_id' })
  mandates: Mandates[];
}
