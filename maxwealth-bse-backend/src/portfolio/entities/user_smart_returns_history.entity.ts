import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Users } from 'src/users/entities/users.entity';

@Entity('user_smart_returns_history')
export class UserSmartReturnsHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  user_id: number;

  @Column({ name: 'transaction_basket_id' })
  transaction_basket_id: number;

  @Column({ type: 'float', name: 'invested_amount' })
  invested_amount: number;

  @Column({ type: 'float', name: 'current_value' })
  current_value: number;

  @Column({ type: 'float', name: 'unrealized_gain' })
  unrealized_gain: number;

  @Column({ type: 'float', name: 'absolute_return' })
  absolute_return: number;

  @Column({ type: 'float', name: 'cagr' })
  cagr: number;

  @Column({ type: 'float', name: 'xirr' })
  xirr: number;

  @Column({ type: 'date', name: 'date' })
  date: Date;

  @Column({ type: 'float', name: 'addjusted_value' })
  addjusted_value: number;

  @Column({ type: 'float', name: 'day_change' })
  day_change: number;

  @ManyToOne(() => Users, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: Users;
}
