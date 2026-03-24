import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Users } from '../../users/entities/users.entity'; // Assuming you have a User entity defined
import { UserOnboardingDetails } from './user_onboarding_details.entity';

@Entity('phone_numbers')
export class PhoneNumber {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'isd', length: 10 })
  isd: string;

  @Column({ name: 'number', length: 100 })
  number: string;

  @Column({ name: 'belongs_to', length: 100 })
  belongs_to: string;

  @Column({ name: 'created_at', type: 'datetime' })
  created_at: Date;

  @Column({ name: 'user_id', type: 'int' })
  user_id: number;

  @ManyToOne(() => Users, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @Column({ type: 'int', nullable: true })
  user_onboarding_detail_id: number;

  @ManyToOne(
    () => UserOnboardingDetails,
    (user_onboarding_detail) => user_onboarding_detail.phone_numbers,
  )
  @JoinColumn({ name: 'user_onboarding_detail_id' })
  user_onboarding_detail: UserOnboardingDetails;
}
