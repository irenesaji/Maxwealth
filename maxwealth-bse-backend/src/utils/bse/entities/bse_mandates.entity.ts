import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('bse_mandates')
export class BseMandates {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ucc: string;

  @Column()
  mem_code: string;

  @Column()
  max_txn_amt: number;

  @Column()
  cur: string;

  @Column()
  start_date: Date;

  @Column()
  valid_till: Date;

  @Column('json')
  details: Record<string, any>;

  @Column()
  mode: string;

  @Column()
  debit_type: string;

  @Column()
  man_2fa: string;

  @Column()
  mandate_id: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
