import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Users } from '../../users/entities/users.entity';
import { UserOnboardingDetails } from './user_onboarding_details.entity';

@Entity('tax_residencies')
export class TaxResidency {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  investor_tax_residency_sequence: number;

  @Column({ type: 'varchar', length: 100 })
  country: string;

  @Column({ type: 'varchar', length: 100 })
  taxid_type: string;

  @Column({ type: 'varchar', length: 100 })
  taxid_number: string;

  @Column({ type: 'int', nullable: true })
  user_id: number;

  @ManyToOne(() => Users, (user) => user.tax_residencies)
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @Column({ type: 'int', nullable: true })
  user_onboarding_detail_id: number;

  @ManyToOne(
    () => UserOnboardingDetails,
    (user_onboarding_detail) => user_onboarding_detail.tax_residencies,
  )
  @JoinColumn({ name: 'user_onboarding_detail_id' })
  user_onboarding_detail: UserOnboardingDetails;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;
}
