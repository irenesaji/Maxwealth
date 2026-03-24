import { Users } from 'src/users/entities/users.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('investor_details')
export class InvestorDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column({ type: 'varchar', length: 255 })
  object: string;

  @Column({ type: 'varchar', length: 255 })
  amc: string;

  @Column({ type: 'varchar', length: 255 })
  number: string;

  @Column({ type: 'varchar', length: 255 })
  dp_id: string;

  @Column({ type: 'varchar', length: 255 })
  client_id: string;

  @Column({ type: 'varchar', length: 255 })
  primary_investor_pan: string;

  @Column({ type: 'varchar', length: 255 })
  secondary_investor_pan: string;

  @Column({ type: 'varchar', length: 255 })
  third_investor_pan: string;

  @Column({ type: 'varchar', length: 50 })
  holding_pattern: string;

  @Column({ type: 'varchar', length: 255 })
  primary_investor_name: string;

  @Column({ type: 'varchar', length: 255 })
  secondary_investor_name: string;

  @Column({ type: 'varchar', length: 255 })
  third_investor_name: string;

  @Column({ type: 'date' })
  primary_investor_dob: Date;

  @Column({ type: 'date' })
  secondary_investor_dob: Date;

  @Column({ type: 'date' })
  third_investor_dob: Date;

  @Column({ type: 'varchar', length: 10 })
  primary_investor_gender: string;

  @Column({ type: 'varchar', length: 10 })
  secondary_investor_gender: string;

  @Column({ type: 'varchar', length: 10 })
  third_investor_gender: string;

  @Column({ type: 'varchar', length: 50 })
  primary_investor_tax_status: string;

  @Column({ type: 'varchar', length: 50 })
  primary_investor_occupation: string;

  @Column({ type: 'varchar', length: 255 })
  guardian_name: string;

  @Column({ type: 'varchar', length: 10 })
  guardian_gender: string;

  @Column({ type: 'varchar', length: 255 })
  guardian_pan: string;

  @Column({ type: 'date' })
  guardian_dob: Date;

  @Column({ type: 'varchar', length: 255 })
  guardian_relationship: string;

  @Column({ type: 'varchar', length: 255 })
  nominee1_name: string;

  @Column({ type: 'date' })
  nominee1_dob: Date;

  @Column({ type: 'varchar', length: 255 })
  nominee1_relationship: string;

  @Column({ type: 'varchar', length: 255 })
  nominee1_guardian: string;

  @Column({ type: 'varchar', length: 255 })
  nominee1_guardian_dob: string;

  @Column({ type: 'decimal' })
  nominee1_allocation_percentage: number;

  @Column({ type: 'varchar', length: 255 })
  nominee2_name: string;

  @Column({ type: 'date' })
  nominee2_dob: Date;

  @Column({ type: 'varchar', length: 255 })
  nominee2_relationship: string;

  @Column({ type: 'varchar', length: 255 })
  nominee2_guardian: string;

  @Column({ type: 'varchar', length: 255 })
  nominee2_guardian_dob: string;

  @Column({ type: 'decimal' })
  nominee2_allocation_percentage: number;

  @Column({ type: 'varchar', length: 255 })
  nominee3_name: string;

  @Column({ type: 'date' })
  nominee3_dob: Date;

  @Column({ type: 'varchar', length: 255 })
  nominee3_relationship: string;

  @Column({ type: 'varchar', length: 255 })
  nominee3_guardian: string;

  @Column({ type: 'varchar', length: 255 })
  nominee3_guardian_dob: string;

  @Column({ type: 'decimal' })
  nominee3_allocation_percentage: number;

  @Column({ type: 'varchar', length: 255 })
  scheme: string;

  @Column({ type: 'varchar', length: 255 })
  scheme_code: string;

  @Column({ type: 'varchar', length: 255 })
  bank_account_name: string;

  @Column({ type: 'varchar', length: 255 })
  bank_account_number: string;

  @Column({ type: 'varchar', length: 50 })
  bank_account_type: string;

  @Column({ type: 'varchar', length: 255 })
  bank_account_ifsc: string;

  @Column({ type: 'varchar', length: 255 })
  address_line1: string;

  @Column({ type: 'varchar', length: 255 })
  address_line2: string;

  @Column({ type: 'varchar', length: 255 })
  address_line3: string;

  @Column({ type: 'varchar', length: 255 })
  city: string;

  @Column({ type: 'varchar', length: 255 })
  state: string;

  @Column({ type: 'varchar', length: 10 })
  postal_code: string;

  @Column({ type: 'varchar', length: 255 })
  country_name: string;

  @Column({ type: 'varchar', length: 10 })
  country_ansi_code: string;

  @Column('text')
  email_address: string;

  @Column('text')
  mobile_number: string;

  @ManyToOne(() => Users, (user) => user.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  users: Users | null;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
