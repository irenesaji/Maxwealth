import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Users } from 'src/users/entities/users.entity';
import { TransactionBaskets } from './transaction_baskets.entity';
import { NodeRuntime } from 'inspector';
import { Purchase } from './purchases.entity';
import { Redemption } from './redemptions.entity';
import { SwitchFunds } from './switch_funds.entity';
import { SkipInstruction } from './sip_skip_instructions.entity';
import { MfRedemptionPlan } from './mf_redemption_plan.entity';
import { MfSwitchPlan } from './mf_switch_plan.entity';
import { MfPurchasePlan } from './mf_purchase_plan.entity';
import { BsePurchaseRedemptionOrder } from './bsev1_purchase_order.entity';

@Entity('transaction_basket_items')
export class TransactionBasketItems {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  transaction_basket_id: number;

  @Column()
  transaction_type: string;

  @Column()
  fund_isin: string;

  @Column({ nullable: true })
  folio_number: string;

  @Column()
  frequency: string;

  @Column()
  installment_day: number;

  @Column()
  number_of_installments: number;

  @Column()
  amount: number;

  @Column()
  units: number;

  @Column({ nullable: true })
  euin: string;

  @Column({ nullable: true })
  partner: string;

  @Column({ nullable: true })
  to_fund_isin: string;

  @Column()
  status: string;

  @Column()
  response_message: string;

  @Column()
  is_consent_verified: boolean;

  @Column()
  user_id: number;

  @Column()
  step_up_amount: number;

  @Column()
  step_up_frequency: string;

  @Column()
  payment_method: string;

  @Column()
  payment_source: string;

  @Column()
  fp_sip_id: string;

  @Column()
  fp_swp_id: string;

  @Column()
  fp_stp_id: string;

  @Column()
  is_payment: boolean;

  @Column()
  start_date: Date;

  @Column()
  end_date: Date;

  @Column()
  next_installment_date: Date;

  @Column()
  previous_installment_date: Date;

  @Column()
  remaining_installments: number;

  @Column()
  created_at: Date;

  @Column()
  activated_at: Date;

  @Column()
  cancelled_at: Date;

  @Column()
  completed_at: Date;

  @Column()
  failed_at: Date;

  @Column()
  is_active: boolean;

  @Column()
  generate_first_installment_now: boolean;

  @Column()
  folio_mobile: string;

  @Column()
  folio_email: string;

  @ManyToOne((type) => Users, (user) => user.transaction_basket_items)
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @OneToMany(() => Purchase, (purchase) => purchase.transaction_basket_item)
  purchases: Purchase[];

  @OneToMany(
    () => BsePurchaseRedemptionOrder,
    (purchase_redemption_order) =>
      purchase_redemption_order.transaction_basket_item,
  )
  purchase_redemption_orders: BsePurchaseRedemptionOrder[];

  @OneToOne(
    () => Redemption,
    (redemption) => redemption.transaction_basket_item,
  )
  redemption: Redemption;

  @OneToOne(
    () => MfRedemptionPlan,
    (mf_redemption_plan) => mf_redemption_plan.transaction_basket_item,
  )
  mf_redemption_plan: MfRedemptionPlan;

  @OneToOne(
    () => MfSwitchPlan,
    (mf_switch_plan) => mf_switch_plan.transaction_basket_item,
  )
  mf_switch_plan: MfSwitchPlan;

  @OneToOne(
    () => MfPurchasePlan,
    (mf_purchase_plan) => mf_purchase_plan.transaction_basket_item,
  )
  mf_purchase_plan: MfPurchasePlan;

  @OneToOne(
    () => SwitchFunds,
    (switch_fund) => switch_fund.transaction_basket_item,
  )
  switch_fund: SwitchFunds;

  @ManyToOne(
    (type) => TransactionBaskets,
    (transaction_basket) => transaction_basket.transaction_basket_items,
  )
  @JoinColumn({ name: 'transaction_basket_id' })
  transaction_basket: TransactionBaskets;

  @OneToMany(
    () => SkipInstruction,
    (skip_instructions) => skip_instructions.transaction_basket_item,
  )
  skip_instructions: SkipInstruction[];
}
