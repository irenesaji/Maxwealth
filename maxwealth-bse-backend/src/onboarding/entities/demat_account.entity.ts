import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Users } from '../../users/entities/users.entity';
import { UserOnboardingDetails } from './user_onboarding_details.entity';

@Entity('demat_accounts')
export class DematAccount {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 256 })
  dp_id: string;

  @Column({ type: 'varchar', length: 256 })
  client_id: string;

  @Column({ type: 'int', nullable: true })
  user_id: number;

  @ManyToOne(() => Users, (user) => user.demat_accounts)
  @JoinColumn({ name: 'user_id' })
  user: Users;

  //   @Column({ type: 'int', nullable: true })
  //   user_onboarding_detail_id: number;

  @ManyToOne(
    () => UserOnboardingDetails,
    (userOnboardingDetails) => userOnboardingDetails.demat_accounts,
  )
  @JoinColumn({ name: 'user_onboarding_detail_id' })
  user_onboarding_details: UserOnboardingDetails;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;
}
