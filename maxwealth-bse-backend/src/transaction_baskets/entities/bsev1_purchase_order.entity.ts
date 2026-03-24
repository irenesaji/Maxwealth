import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TransactionBasketItems } from './transaction_basket_items.entity';

@Entity('bse_purchase_redemption_order')
export class BsePurchaseRedemptionOrder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;

  @Column()
  transaction_code: string;

  @Column()
  transaction_no: string;

  @Column()
  order_id: number;

  @Column()
  user_id: number;

  @Column()
  member_id: string;

  @Column()
  client_code: string;

  @Column()
  scheme_code: string;

  @Column()
  buy_sell: string;

  @Column()
  buy_sell_type: string;

  @Column()
  dp_trans_mode: string;

  @Column({ type: 'decimal', scale: 10, precision: 2 })
  amount: number;

  @Column({ type: 'decimal', scale: 10, precision: 2 })
  qty: number;

  @Column()
  all_redeem: string;

  @Column()
  folio_no: string;

  @Column()
  remarks: string;

  @Column()
  kyc_status: string;

  @Column()
  int_ref_no: string;

  @Column()
  sub_br_code: string;

  @Column()
  euin: string;

  @Column()
  euin_flag: string;

  @Column()
  min_redeem: string;

  @Column()
  dpc: string;

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
  mobile_no: string;

  @Column()
  email: string;

  @Column()
  mandate_id: string;

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
  reg_no: number;

  @Column()
  transaction_basket_item_id: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(
    () => TransactionBasketItems,
    (transaction_basket_item) =>
      transaction_basket_item.purchase_redemption_orders,
  )
  @JoinColumn({ name: 'transaction_basket_item_id' })
  transaction_basket_item: TransactionBasketItems;
}
