import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { RzpOrder } from './rzp_orders.entity';

@Entity('rzp_transfers')
export class RzpTransfer {
  @PrimaryColumn()
  id: string;

  @Column()
  entity: string;

  @Column()
  status: string;

  @Column()
  source: string;

  @Column()
  recipient: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column()
  currency: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amount_reversed: number;

  @Column('json', { nullable: true })
  notes: Record<string, any>;

  @Column('json', { nullable: true })
  linked_account_notes: string[];

  @Column()
  on_hold: boolean;

  @Column('bigint', { nullable: true })
  on_hold_until: number;

  @Column({ nullable: true })
  recipient_settlement_id: string;

  @Column('bigint')
  created_at: number;

  @Column('bigint', { nullable: true })
  processed_at: number;

  @Column('json', { nullable: true })
  error: Record<string, any>;

  @Column('json', { nullable: true })
  recipient_details: Record<string, any>;

  @Column()
  rzp_order_id: string;

  @ManyToOne(() => RzpOrder, (rzp_order) => rzp_order.transfers)
  @JoinColumn({ name: 'rzp_order_id' })
  rzp_order: RzpOrder;
}
