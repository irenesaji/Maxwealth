import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Users } from 'src/users/entities/users.entity';
import { TransactionBasketItems } from './transaction_basket_items.entity';
import { RzpOrder } from 'src/utils/razorpay/entities/rzp_orders.entity';

@Entity('transaction_baskets')
export class TransactionBaskets {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column()
  goal_id: number;

  @Column()
  is_smart_sip: boolean;

  @Column()
  consent_email: string;

  @Column()
  consent_isd_code: string;

  @Column()
  consent_mobile: string;

  @Column()
  otp: number;

  @Column()
  is_consent_verified: boolean;

  @Column()
  status: string;

  @Column()
  payment_id: string;

  @Column()
  payment_status: string;

  @Column()
  payment_failure_reason: string;

  @Column()
  created_by: string;

  @Column()
  created_at: Date;

  @Column()
  updated_at: Date;

  @Column()
  total_amount: number;

  @Column()
  model_portfolio_id: number;

  @Column()
  payment_page: string;

  @Column()
  is_euin: boolean;

  // @ManyToOne(type => Users, user => user.transaction_baskets)
  // @JoinColumn({name: 'user_id'})
  // user: Users;

  @OneToMany(
    (type) => TransactionBasketItems,
    (transaction_basket_items) => transaction_basket_items.transaction_basket,
  )
  @JoinColumn({ name: 'transaction_basket_id' })
  transaction_basket_items: TransactionBasketItems[];

  @OneToMany(() => RzpOrder, (rzp_order) => rzp_order.transaction_basket)
  rzp_orders: RzpOrder[];
}
