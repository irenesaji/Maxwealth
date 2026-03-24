import {
  Entity,
  Column,
  PrimaryColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { RzpTransfer } from './rzp_transfer.entity';
import { Users } from 'src/users/entities/users.entity';
import { TransactionBaskets } from 'src/transaction_baskets/entities/transaction_baskets.entity';

@Entity('rzp_orders')
export class RzpOrder {
  @PrimaryColumn()
  id: string;

  @Column()
  entity: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column('decimal', { precision: 10, scale: 2 })
  amount_paid: number;

  @Column('decimal', { precision: 10, scale: 2 })
  amount_due: number;

  @Column()
  currency: string;

  @Column({ nullable: true })
  receipt: string;

  @Column({ nullable: true })
  offer_id: string;

  @Column()
  status: string;

  @Column()
  attempts: number;

  @Column('bigint')
  created_at: number;

  @Column('int')
  user_id: number;

  @Column('int')
  transaction_basket_id: number;

  @ManyToOne(() => Users, (user) => user.rzp_orders)
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @ManyToOne(
    () => TransactionBaskets,
    (transaction_basket) => transaction_basket.rzp_orders,
  )
  @JoinColumn({ name: 'transaction_basket_id' })
  transaction_basket: TransactionBaskets;

  @OneToMany(() => RzpTransfer, (transfer) => transfer.rzp_order)
  transfers: RzpTransfer[];
}
