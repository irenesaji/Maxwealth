import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { Users } from 'src/users/entities/users.entity';
import { TransactionBasketItems } from './transaction_basket_items.entity';
import { v4 as uuidv4 } from 'uuid';
import { SwitchFunds } from './switch_funds.entity';

@Entity('mf_switch_plans')
export class MfSwitchPlan {
  @PrimaryColumn({ type: 'varchar', length: 50 })
  id: string;

  @Column({ type: 'varchar', length: 20 })
  state: string;

  @Column({ type: 'boolean', default: true })
  systematic: boolean;

  @Column({ type: 'varchar', length: 50, nullable: true })
  mf_investment_account?: string;

  @Column({ type: 'varchar', length: 20 })
  folio_number: string;

  @Column({ type: 'varchar', length: 20 })
  frequency: string;

  @Column({ type: 'varchar', length: 20 })
  switch_in_scheme: string;

  @Column({ type: 'varchar', length: 20 })
  switch_out_scheme: string;

  @Column({ type: 'int' })
  installment_day: number;

  @Column({ type: 'date' })
  start_date: Date;

  @Column({ type: 'date' })
  end_date: Date;

  @Column({ type: 'int' })
  number_of_installments: number;

  @Column({ type: 'boolean', default: true })
  auto_generate_installments: boolean;

  @Column({ type: 'date', nullable: true })
  next_installment_date?: string;

  @Column({ type: 'date', nullable: true })
  previous_installment_date?: string;

  @Column({ type: 'int', nullable: true })
  remaining_installments?: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  source_ref_id?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  euin?: string;

  @Column({ type: 'varchar', length: 50 })
  partner: string;

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;

  @Column({ type: 'datetime', nullable: true })
  activated_at?: Date;

  @Column({ type: 'datetime', nullable: true })
  requested_activation_date?: Date;

  @Column({ type: 'datetime', nullable: true })
  cancelled_at?: Date;

  @Column({ type: 'datetime', nullable: true })
  completed_at?: Date;

  @Column({ type: 'datetime', nullable: true })
  failed_at?: Date;

  @Column({ type: 'datetime', nullable: true })
  cancellation_scheduled_on?: Date;

  @Column({ type: 'varchar', length: 20 })
  gateway: string;

  @Column({ type: 'varchar', length: 45, nullable: true })
  user_ip?: string;

  @Column({ type: 'varchar', length: 45, nullable: true })
  server_ip?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  initiated_by?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  initiated_via?: string;

  @Column({ type: 'text', nullable: true })
  reason?: string;

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
  dest_folio: string;

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
  stp_register_id: string;

  @Column()
  user_id: number;

  @Column()
  transaction_basket_item_id: number;

  @ManyToOne(() => Users, (user) => user.mf_switch_plans)
  @JoinColumn({ name: 'user_id' })
  user?: Users;

  @OneToOne(
    () => TransactionBasketItems,
    (transactionBasketItem) => transactionBasketItem.mf_switch_plan,
  )
  @JoinColumn({ name: 'transaction_basket_item_id' })
  transaction_basket_item?: TransactionBasketItems;

  @OneToMany(() => SwitchFunds, (switch_funds) => switch_funds.mf_switch_plan)
  switch_funds: SwitchFunds[];

  @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @BeforeInsert()
  generateId() {
    if (!this.id) {
      this.id = uuidv4(); // Generate a new UUID if id is not provided
    }
  }
}
