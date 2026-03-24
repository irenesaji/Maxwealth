import { Users } from 'src/users/entities/users.entity';
import {
  Entity,
  Column,
  PrimaryColumn,
  BeforeInsert,
  ManyToOne,
  JoinColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { TransactionBasketItems } from './transaction_basket_items.entity';
import { Purchase } from './purchases.entity';
@Entity('mf_purchase_plans')
export class MfPurchasePlan {
  @PrimaryColumn({ type: 'varchar', length: 50 })
  id: string;

  @Column({ type: 'varchar', length: 20 })
  state: string;

  @Column({ name: 'mf_investment_account', type: 'varchar', length: 50 })
  mf_investment_account: string;

  @Column({ name: 'folio_number', type: 'varchar', length: 20, nullable: true })
  folio_number: string;

  @Column({ type: 'boolean' })
  systematic: boolean;

  @Column({ type: 'enum', enum: ['daily', 'weekly', 'monthly', 'quarterly'] })
  frequency: string;

  @Column({ type: 'varchar', length: 20 })
  scheme: string;

  @Column({ name: 'auto_generate_instalments', type: 'boolean' })
  auto_generate_installments: boolean;

  @Column({ name: 'installment_day', type: 'int' })
  installment_day: number;

  @Column({ name: 'start_date', type: 'date' })
  start_date: Date;

  @Column({ name: 'end_date', type: 'date', nullable: true })
  end_date: Date;

  @Column({
    name: 'requested_activation_date',
    type: 'datetime',
    nullable: true,
  })
  requested_activation_date: Date;

  @Column({ name: 'number_of_installments', type: 'int' })
  number_of_installments: number;

  @Column({ name: 'next_installment_date', type: 'date', nullable: true })
  next_installment_date: string;

  @Column({ name: 'previous_installment_date', type: 'date', nullable: true })
  previous_installment_date: string;

  @Column({ name: 'remaining_installments', type: 'int', nullable: true })
  remaining_installments: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount: number;

  @Column({
    name: 'payment_method',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  payment_method: string;

  @Column({
    name: 'payment_source',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  payment_source: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  purpose: string;

  @Column({
    name: 'source_ref_id',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  source_ref_id: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  euin: string;

  @Column({ type: 'varchar', length: 50 })
  partner: string;

  @Column({ name: 'created_at', type: 'datetime' })
  created_at: Date;

  @Column({ name: 'activated_at', type: 'datetime', nullable: true })
  activated_at: Date;

  @Column({ name: 'cancelled_at', type: 'datetime', nullable: true })
  cancelled_at: Date;

  @Column({ name: 'completed_at', type: 'datetime', nullable: true })
  completed_at: Date;

  @Column({ name: 'failed_at', type: 'datetime', nullable: true })
  failed_at: Date;

  @Column({
    name: 'cancellation_scheduled_on',
    type: 'datetime',
    nullable: true,
  })
  cancellation_scheduled_on: Date;

  @Column({
    name: 'cancellation_code',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  cancellation_code: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  reason: string;

  @Column({ type: 'varchar', length: 20 })
  gateway: string;

  @Column({ name: 'user_ip', type: 'varchar', length: 45, nullable: true })
  user_ip: string;

  @Column({ name: 'server_ip', type: 'varchar', length: 45, nullable: true })
  server_ip: string;

  @Column({
    name: 'initiated_by',
    type: 'enum',
    enum: ['investor', 'advisor', 'system'],
    nullable: true,
  })
  initiated_by: string;

  @Column({
    name: 'initiated_via',
    type: 'enum',
    enum: ['mobile_app', 'web_app'],
    nullable: true,
  })
  initiated_via: string;

  @Column()
  sxp_type: string;

  @Column()
  mem_ord_ref_id: string;

  @Column()
  ucc: string;

  @Column()
  member: string;

  @Column()
  amc_code: string;

  @Column()
  cur: string;

  @Column()
  phys_or_demat: string;

  @Column()
  isunits: boolean;

  @Column()
  dpc: boolean;

  @Column()
  payment_ref_id: string;

  @Column()
  euin_flag: boolean;

  @Column()
  sub_br_code: string;

  @Column()
  sub_br_arn: string;

  @Column()
  partner_id: string;

  @Column()
  remark: string;

  @Column()
  first_order_today: boolean;

  @Column()
  brokerage: number;

  @Column()
  sip_register_id: string;

  @Column()
  user_id: number;

  @Column()
  transaction_basket_item_id: number;

  @ManyToOne(() => Users, (user) => user.mf_purchase_plans)
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @OneToOne(() => TransactionBasketItems)
  @JoinColumn({ name: 'transaction_basket_item_id' })
  transaction_basket_item: TransactionBasketItems;

  @OneToMany(() => Purchase, (purchases) => purchases.mf_purchase_plan)
  purchases: Purchase[];

  @BeforeInsert()
  generateId() {
    if (!this.id) {
      this.id = uuidv4(); // Generate a new UUID if id is not provided
    }
  }
}
