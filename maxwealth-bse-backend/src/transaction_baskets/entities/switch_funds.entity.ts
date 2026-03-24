import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';

import { TransactionBasketItems } from './transaction_basket_items.entity';
import { MfSwitchPlan } from './mf_switch_plan.entity';
import { Users } from 'src/users/entities/users.entity';

@Entity({ name: 'switch_funds' })
export class SwitchFunds {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fp_id: string;

  @Column()
  old_id: number;

  @Column()
  mf_investment_account: string;

  @Column()
  folio_number: string;

  @Column()
  state: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  units: number;

  @Column()
  switch_out_scheme: string;

  @Column()
  switch_in_scheme: string;

  @Column({ nullable: true })
  plan: string;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  switched_out_units: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  switched_out_amount: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  switched_out_price: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  switched_in_units: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  switched_in_amount: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  switched_in_price: number;

  @Column()
  gateway: string;

  @Column({ nullable: true })
  traded_on: Date;

  @Column()
  scheduled_on: Date;

  @Column()
  created_at: Date;

  @Column({ nullable: true })
  succeeded_at: Date;

  @Column({ nullable: true })
  submitted_at: Date;

  @Column({ nullable: true })
  reversed_at: Date;

  @Column({ nullable: true })
  failed_at: Date;

  @Column({ nullable: true })
  confirmed_at: Date;

  @Column({ nullable: true })
  source_ref_id: string;

  @Column({ nullable: true })
  user_ip: string;

  @Column({ nullable: true })
  server_ip: string;

  @Column()
  initiated_by: string;

  @Column()
  initiated_via: string;

  @Column({ nullable: true })
  euin: string;

  @Column({ nullable: true })
  partner: string;

  @Column({ nullable: true })
  failure_code: string;

  @Column()
  src: string;

  @Column()
  type: string;

  @Column()
  mem_ord_ref_id: string;

  @Column()
  ucc: string;

  @Column()
  member: string;

  @Column()
  cur: string;

  @Column()
  is_units: boolean;

  @Column()
  all_units: boolean;

  @Column()
  is_fresh: boolean;

  @Column()
  phys_or_demat: string;

  @Column()
  payment_ref_id: string;

  @Column()
  min_redeem_flag: boolean;

  @Column()
  info_src: string;

  @Column()
  reg_no: string;

  @Column()
  euin_flag: boolean;

  @Column()
  exch_mandate_id: number;

  @Column()
  kyc_passed: boolean;

  @Column()
  dpc: boolean;

  @Column()
  stp_order_id: string;

  @Column()
  user_id: number;

  @Column()
  switch_order_no: number;

  @Column()
  transaction_basket_item_id: number;

  @ManyToOne(() => Users, (user) => user.switch_funds)
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @ManyToOne(
    () => MfSwitchPlan,
    (mf_switch_plan) => mf_switch_plan.switch_funds,
  )
  @JoinColumn({ name: 'plan' })
  mf_switch_plan: MfSwitchPlan;

  @OneToOne(
    () => TransactionBasketItems,
    (transaction_basket_item) => transaction_basket_item.switch_fund,
  )
  @JoinColumn({ name: 'transaction_basket_item_id' })
  transaction_basket_item: TransactionBasketItems;
}
