import { UserBankDetails } from 'src/onboarding/bank/entities/user_bank_details.entity';
import { Users } from 'src/users/entities/users.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

@Entity()
export class Mandates {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  mandate_type: string;

  @Column({})
  fp_bank_id: number;

  @Column({})
  bank_id: number;

  @Column()
  mandate_limit: number;

  @Column()
  provider_name: string;

  @Column()
  valid_from: string;

  @Column()
  mandate_id: string;

  @Column()
  token_url: string;

  @Column()
  paymentId: string;

  @Column()
  status: string;

  @Column()
  failureReason: string;

  @Column()
  user_id: number;

  @Column()
  rejected_reason: string;

  @Column()
  customer_id: string;

  @Column()
  rejected_at: Date;

  @Column()
  received_at: Date;

  @Column()
  approved_at: Date;

  @Column()
  submitted_at: Date;

  @Column()
  cancelled_at: Date;

  @ManyToOne((type) => Users, (user) => user.mandates)
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @ManyToOne(
    (type) => UserBankDetails,
    (user_bank_detail) => user_bank_detail.mandates,
  )
  @JoinColumn({ name: 'bank_id' })
  user_bank_detail: UserBankDetails;

  @Column()
  created_at: Date;

  @Column()
  updated_at: Date;
}
