import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('bse_swp_register')
export class BseSwpRegister {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  client_code: string;

  @Column()
  bse_scheme_code: string;

  @Column()
  transaction_mode: string;

  @Column()
  folio_no: string;

  @Column()
  internal_ref_no: string;

  @Column()
  start_date: string;

  @Column()
  no_of_withdrawls: number;

  @Column()
  frequency_type: string;

  @Column({ type: 'decimal', scale: 25, precision: 3 })
  installment_amount: number;

  @Column({ type: 'decimal', scale: 25, precision: 3 })
  installment_units: number;

  @Column()
  first_order_today: string;

  @Column()
  sub_br_code: string;

  @Column()
  euin_declaration_flag: string;

  @Column()
  euin: string;

  @Column()
  remarks: string;

  @Column()
  sub_broker_arn: string;

  @Column()
  mobile_no: number;

  @Column()
  email: string;

  @Column()
  bank_account_no: string;

  @Column()
  transaction_basket_item_id: number;

  @Column({ type: 'bigint' })
  swp_reg_id: number;

  @Column()
  bse_remarks: string;

  @Column()
  success_flag: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
