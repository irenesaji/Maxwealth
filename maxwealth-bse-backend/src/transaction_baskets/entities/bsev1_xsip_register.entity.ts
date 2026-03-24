import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('bse_xsip_register')
export class BseXSipRegister {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  login_id: string;

  @Column()
  member_id: string;

  @Column()
  password: string;

  @Column()
  scheme_code: string;

  @Column()
  client_code: string;

  @Column()
  internal_ref_no: string;

  @Column()
  trans_mode: string;

  @Column()
  dp_trans_mode: string;

  @Column()
  start_date: string;

  @Column()
  frequency_type: string;

  @Column()
  frequency_allowed: boolean;

  @Column({ type: 'decimal', scale: 10, precision: 2 })
  installment_amount: number;

  @Column()
  no_of_installemnts: number;

  @Column()
  remarks: string;

  @Column()
  folio_no: string;

  @Column()
  first_order_flag: string;

  @Column()
  sub_br_code: string;

  @Column()
  euin: string;

  @Column()
  euin_declaration_flag: string;

  @Column()
  dpc: string;

  @Column()
  sub_broker_arn: string;

  @Column()
  end_date: string;

  @Column()
  registration_type: string;

  @Column({ type: 'decimal', scale: 10, precision: 2 })
  brokerage: number;

  @Column()
  mandate_id: string;

  @Column()
  xsip_type: string;

  @Column()
  target_scheme: string;

  @Column({ type: 'decimal', scale: 10, precision: 2 })
  target_amount: number;

  @Column()
  goal_type: string;

  @Column({ type: 'decimal', scale: 10, precision: 2 })
  goal_amount: number;

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

  @Column({ type: 'bigint' })
  xsip_reg_id: number;

  @Column()
  bse_remarks: string;

  @Column()
  success_flag: string;

  @Column()
  internal_reference_number: string;

  @Column()
  response_filler1: string;

  @Column()
  response_filler2: string;

  @Column()
  response_filler3: string;

  @Column()
  response_filler4: string;

  @Column()
  response_filler5: string;

  @Column()
  transaction_basket_item_id: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
