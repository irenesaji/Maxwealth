import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('amcs')
export class Amc {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'amc_id' })
  amcId: number;

  @Column()
  name: string;

  @Column({ name: 'is_active' })
  is_active: boolean;

  @Column({ name: 'supporting_document' })
  supporting_document: string;

  @Column({ name: 'status' })
  status: string;

  @Column({ name: 'reject_reason' })
  reject_reason: string;

  @Column({ name: 'approved_by' })
  approved_by: string;

  @Column()
  rta: string;

  @Column()
  rta_amc_code: string;

  @Column()
  deposit_bank_name: string;

  @Column()
  deposit_account_no: string;

  @Column()
  deposit_ifsc_code: string;

  @Column()
  linked_account_id: string;

  @Column({ name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ name: 'updated_at', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
