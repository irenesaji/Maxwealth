import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { TransactionBasketItems } from './transaction_basket_items.entity';
import { MfRedemptionPlan } from './mf_redemption_plan.entity';
import { Users } from 'src/users/entities/users.entity';
import { column } from 'mathjs';

@Entity('redemptions')
export class Redemption {
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

  @Column()
  scheme: string;

  @Column()
  redemption_mode: string;

  @Column({ nullable: true })
  traded_on: Date;

  @Column({ nullable: true })
  failed_at: Date;

  @Column({ nullable: true })
  plan: string;

  @Column({ nullable: true })
  euin: string;

  @Column()
  partner: string;

  @Column()
  distributor_id: string;

  @Column('decimal', { precision: 10, scale: 2 })
  units: number;

  @Column({ nullable: true })
  redeemed_price: number;

  @Column('decimal', { precision: 10, scale: 2 })
  redeemed_units: number;

  @Column({ nullable: true })
  redeemed_amount: number;

  @Column({ nullable: true })
  redemption_bank_account_number: string;

  @Column({ nullable: true })
  redemption_bank_account_ifsc_code: string;

  @Column()
  scheduled_on: Date;

  @Column()
  created_at: Date;

  @Column({ nullable: true })
  confirmed_at: Date;

  @Column({ nullable: true })
  succeeded_at: Date;

  @Column({ nullable: true })
  submitted_at: Date;

  @Column({ nullable: true })
  reversed_at: Date;

  @Column()
  gateway: string;

  @Column()
  initiated_by: string;

  @Column()
  initiated_via: string;

  @Column()
  source_ref_id: string;

  @Column()
  user_ip: string;

  @Column()
  server_ip: string;

  @Column()
  user_id: number;

  @Column()
  transaction_basket_item_id: number;

  @Column()
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
  swp_order_id: string;

  @Column()
  bse_order_no: number;

  @ManyToOne(() => Users, (user) => user.redemptions)
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @ManyToOne(
    () => MfRedemptionPlan,
    (mf_redemption_plan) => mf_redemption_plan.redemptions,
  )
  @JoinColumn({ name: 'plan' })
  mf_redemption_plan: MfRedemptionPlan;

  @OneToOne(
    () => TransactionBasketItems,
    (transaction_basket_item) => transaction_basket_item.redemption,
  )
  @JoinColumn({ name: 'transaction_basket_item_id' })
  transaction_basket_item: TransactionBasketItems;
}
