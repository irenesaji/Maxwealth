import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('bse_xsip_order')
export class BseXSipOrder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  transaction_code: string;

  @Column()
  unique_reference_no: string;

  @Column()
  scheme_code: string;

  @Column()
  member_id: string;

  @Column()
  client_code: string;

  @Column()
  user_id: string;

  @Column()
  int_ref_no: string;

  @Column()
  transaction_mode: string;

  @Column()
  dp_trans_mode: string;

  @Column()
  start_date: string;

  @Column()
  frequency_type: string;

  @Column()
  frequency_allowed: number;

  @Column({ type: 'decimal', scale: 10, precision: 2 })
  installment_amount: number;

  @Column()
  no_of_installments: number;

  @Column()
  remarks: string;

  @Column()
  folio_no: string;

  @Column()
  first_order_flag: string;

  @Column({ type: 'decimal', scale: 10, precision: 2 })
  brokerage: number;

  @Column()
  mandate_id: number;

  @Column()
  sub_br_code: string;

  @Column()
  euin: string;

  @Column()
  euin_flag: string;

  @Column()
  dpc: string;

  @Column()
  xsip_reg_id: number;

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

  @Column()
  bse_remarks: string;

  @Column()
  success_flag: string;

  @Column()
  order_no: number;

  @Column()
  transaction_basket_item_id: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
