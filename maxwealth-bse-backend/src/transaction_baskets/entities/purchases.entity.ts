import {
  Entity,
  PrimaryColumn,
  Column,
  BaseEntity,
  ManyToOne,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Users } from 'src/users/entities/users.entity';
import { TransactionBaskets } from './transaction_baskets.entity';
import { TransactionBasketItems } from './transaction_basket_items.entity';
import { MfPurchasePlan } from './mf_purchase_plan.entity';

@Entity('purchases')
export class Purchase extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  old_id: number;

  @Column()
  fp_id: string;

  @Column()
  plan: string;

  @Column({ length: 20 })
  state: string;

  @Column({ length: 20, name: 'folio_number' })
  folio_number: string;

  @Column()
  systematic: boolean;

  @Column({ length: 20 })
  frequency: string;

  @Column({ length: 20 })
  scheme: string;

  @Column({ name: 'auto_generate_instalments' })
  auto_generate_instalments: boolean;

  @Column({ name: 'installment_day' })
  installment_day: number;

  @Column({ type: 'date', name: 'start_date' })
  start_date: Date;

  @Column({ type: 'date', name: 'end_date' })
  end_date: Date;

  @Column({ type: 'date', name: 'requested_activation_date', nullable: true })
  requested_activation_date: Date;

  @Column({ name: 'number_of_installments' })
  number_of_installments: number;

  @Column({ type: 'date', name: 'next_installment_date' })
  next_installment_date: Date;

  @Column({ type: 'date', name: 'previous_installment_date' })
  previousInstallmentDate: Date;

  @Column({ name: 'remaining_installments' })
  remaining_installments: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ length: 50, nullable: true, name: 'payment_method' })
  payment_method: string;

  @Column({ length: 50, nullable: true, name: 'payment_source' })
  payment_source: string;

  @Column({ length: 50 })
  purpose: string;

  @Column({ length: 50, nullable: true, name: 'source_ref_id' })
  source_ref_id: string;

  @Column({ length: 20, nullable: true })
  euin: string;

  @Column({ length: 50 })
  partner: string;

  @Column({ type: 'datetime', name: 'created_at' })
  created_at: Date;

  @Column({ type: 'datetime', name: 'activated_at' })
  activated_at: Date;

  @Column({ type: 'datetime', nullable: true, name: 'cancelled_at' })
  cancelled_at: Date;

  @Column({ type: 'datetime', nullable: true, name: 'completed_at' })
  completed_at: Date;

  @Column({ type: 'datetime', nullable: true, name: 'failed_at' })
  failed_at: Date;

  @Column({
    type: 'datetime',
    nullable: true,
    name: 'cancellation_scheduled_on',
  })
  cancellation_scheduled_on: Date;

  @Column({ length: 50, nullable: true })
  reason: string;

  @Column({ length: 50 })
  gateway: string;

  @Column({ length: 50, nullable: true, name: 'user_ip' })
  user_ip: string;

  @Column({ length: 50, nullable: true, name: 'server_ip' })
  server_ip: string;

  @Column({ length: 20, name: 'initiated_by' })
  initiated_by: string;

  @Column({ length: 20, name: 'initiated_via' })
  initiated_via: string;

  @Column({ type: 'datetime', nullable: true })
  reversed_at: Date;

  @Column({ type: 'datetime', nullable: true })
  submitted_at: Date;

  @Column({ type: 'datetime', nullable: true })
  succeeded_at: Date;

  @Column({ type: 'datetime', nullable: true })
  scheduled_on: Date;

  @Column({ type: 'datetime', nullable: true })
  traded_on: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  allotted_units: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  purchased_price: number;

  @Column({ type: 'datetime', nullable: true })
  retried_at: Date;

  @Column({ type: 'datetime', nullable: true })
  confirmed_at: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
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
  sip_order_id: string;

  @Column({ name: 'user_id' })
  user_id: number;

  @Column()
  order_number: number;

  @ManyToOne(
    () => MfPurchasePlan,
    (mf_purchase_plan) => mf_purchase_plan.purchases,
  )
  @JoinColumn({ name: 'plan' })
  mf_purchase_plan: MfPurchasePlan;

  @ManyToOne(() => Users, (user) => user.purchases)
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @Column()
  transaction_basket_item_id: number;

  @ManyToOne(
    () => TransactionBasketItems,
    (transaction_basket_item) => transaction_basket_item.purchases,
  )
  @JoinColumn({ name: 'transaction_basket_item_id' })
  transaction_basket_item: TransactionBasketItems;
}
