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

@Entity('user_address_details')
export class UserAddressDetails {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  pincode: string;

  @Column({ nullable: false })
  line_1: string;

  @Column({ nullable: true, default: null })
  line_2: string;

  @Column({ nullable: true, default: null })
  line_3: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  user_id: number;

  @OneToOne(() => Users)
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @Column({ type: 'int', nullable: true })
  user_onboarding_detail_id: number;

  @ManyToOne(
    () => UserOnboardingDetails,
    (user_onboarding_detail) => user_onboarding_detail.user_address_details,
  )
  @JoinColumn({ name: 'user_onboarding_detail_id' })
  user_onboarding_detail: UserOnboardingDetails;

  @Column()
  created_at: Date;

  @Column()
  updated_at: Date;
}
