import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Users } from 'src/users/entities/users.entity';
import { KycStatusDetail } from './kyc_status_details.entity';

@Entity('signzy_kyc_objects')
export class SignzyKycObject {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  username: string;

  @Column({ type: 'varchar', length: 255 })
  phone: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'varchar', length: 255 })
  initial_namespace: string;

  @Column({ type: 'varchar', length: 255 })
  eventual_namespace: string;

  @Column({ type: 'varchar', length: 255 })
  channel_id: string;

  @Column({ type: 'varchar', length: 100 })
  status: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updated_at: Date;

  @ManyToOne(() => Users, (user) => user.signzy_kyc_objects)
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @OneToMany(
    () => KycStatusDetail,
    (kycStatusDetail) => kycStatusDetail.signzy_kyc_object,
  )
  kyc_status_details: KycStatusDetail[];
}
