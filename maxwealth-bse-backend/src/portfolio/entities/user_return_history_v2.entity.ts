import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Users } from 'src/users/entities/users.entity';

@Entity('user_returns_history_v2')
export class UserReturnsHistoryVerison2 {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  user_id: number;

  @Column({ type: 'float', name: 'day_change_amount' })
  day_change_amount: number;

  @Column({ type: 'float', name: 'day_change_percentage' })
  day_change_percentage: number;

  @Column({ type: 'float', name: 'total_returns' })
  total_returns: number;

  @Column({ type: 'float', name: 'total_returns_percentage' })
  total_returns_percentage: number;

  @Column({ type: 'float', name: 'invested_amount' })
  invested_amount: number;

  @Column({ type: 'float', name: 'current_value' })
  current_value: number;

  @Column({ type: 'date', name: 'date' })
  date: Date;

  @ManyToOne(() => Users)
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
