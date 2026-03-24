import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('bse_stp_register')
export class BseStpRegister {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  login_id: string;

  @Column()
  member_id: string;

  @Column()
  password: string;

  @Column()
  transaction_type: string;

  @Column()
  stp_type: string;

  @Column()
  client_code: string;

  @Column()
  from_bse_scheme_code: string;

  @Column()
  to_bse_scheme_code: string;

  @Column()
  buy_sell_type: string;

  @Column()
  transaction_mode: string;

  @Column()
  folio_no: string;

  @Column() //{ type: 'bigint' }
  stp_registration_no: string;

  @Column()
  internal_ref_no: string;

  @Column()
  start_date: string;

  @Column()
  frequency_type: string;

  @Column()
  no_of_transfers: number;

  @Column({ type: 'decimal', scale: 25, precision: 3 })
  installment_amount: number;

  @Column()
  units: number;

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
  end_date: string;

  @Column()
  sub_broker_arn: string;

  @Column()
  filler_1: string;

  @Column()
  filler_2: string;

  @Column()
  filler_3: string;

  @Column()
  filler_4: string;

  @Column()
  filler_5: string;

  @Column() //{ type: 'bigint' }
  response_stp_reg_no: string;

  @Column()
  bse_remarks: string;

  @Column()
  success_flag: string;

  @Column() //{ type: 'bigint' }
  from_order_no: string;

  @Column() //{ type: 'bigint' }
  to_order_no: string;

  @Column()
  transaction_basket_item_id: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
