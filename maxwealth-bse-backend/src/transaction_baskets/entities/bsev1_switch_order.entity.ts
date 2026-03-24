import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('bse_switch_order')
export class BseSwitchOrder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;

  @Column()
  transaction_code: string;

  @Column()
  unique_reference_no: string;

  @Column({ type: 'bigint' })
  order_id: number;

  @Column({ type: 'bigint' })
  user_id: number;

  @Column()
  member_id: string;

  @Column()
  client_code: string;

  @Column()
  from_scheme_code: string;

  @Column()
  to_scheme_code: string;

  @Column()
  buy_sell: string;

  @Column()
  buy_sell_type: string;

  @Column()
  dp_trans_mode: string;

  @Column()
  int_ref_no: string;

  @Column({ type: 'decimal', scale: 10, precision: 2 })
  switch_amount: number;

  @Column({ type: 'decimal', scale: 10, precision: 2 })
  switch_units: number;

  @Column()
  all_units_flag: string;

  @Column()
  folio_no: string;

  @Column()
  remarks: string;

  @Column()
  kyc_status: string;

  @Column()
  sub_br_code: string;

  @Column()
  euin: string;

  @Column()
  euin_flag: string;

  @Column()
  min_redeem: string;

  @Column()
  ip_add: string;

  @Column()
  password: string;

  @Column()
  passKey: string;

  @Column()
  param1: string;

  @Column()
  param2: string;

  @Column()
  param3: string;

  @Column()
  filler1: string;

  @Column()
  filler2: string;

  @Column()
  filler3: string;

  @Column()
  filler4: string;

  @Column()
  filler5: string;

  @Column()
  filler6: string;

  @Column({ type: 'bigint' })
  order_no: number;

  @Column()
  bse_remarks: string;

  @Column()
  success_flag: string;

  @Column()
  register_no: number;

  @Column()
  transaction_basket_item_id: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
