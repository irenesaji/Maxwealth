import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('razorpay_penny_drops')
export class RazorpayPennyDrops {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 225 })
  razorpay_id: string;

  @Column({ type: 'varchar', length: 75, default: 'optimized' })
  validation_type: string;

  @Column({ type: 'varchar', length: 75 })
  account_type: string;

  @Column({ type: 'varchar', length: 225 })
  name: string;

  @Column({ type: 'varchar', length: 225 })
  ifsc: string;

  @Column({ type: 'varchar', length: 225 })
  account_number: string;

  @Column({ type: 'varchar', length: 225 })
  contact_name: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  contact: string;

  @Column({ type: 'int' })
  user_id: number;

  @Column({ type: 'varchar', length: 75 })
  status: string;

  @Column({ type: 'varchar', length: 75 })
  account_status: string;

  @Column({ type: 'varchar', length: 255 })
  registered_name: string;

  @Column({ type: 'varchar', length: 255 })
  details: string;

  @Column({ type: 'float' })
  name_match_score: number;

  @Column({ type: 'text' })
  status_detail_decription: string;

  @Column({ type: 'varchar', length: 255 })
  status_detail_source: string;

  @Column({ type: 'varchar', length: 255 })
  status_detail_reason: string;
}
