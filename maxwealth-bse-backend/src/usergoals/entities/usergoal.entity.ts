import { Goal } from 'src/goals/entities/goals.entity';
import { Users } from 'src/users/entities/users.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('user_goals')
export class UserGoals {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Users)
  @JoinColumn({ name: 'user_id' })
  users: Users;

  @ManyToOne(() => Goal)
  @JoinColumn({ name: 'goal_id' })
  goal: Goal;

  @Column({ type: 'varchar', length: 200, nullable: true })
  goal_name: string;

  @Column()
  user_id: number;

  @Column()
  goal_id: number;

  @Column({ type: 'bigint', nullable: true })
  current_cost: number;

  @Column({ type: 'bigint', nullable: true })
  current_monthly_expenses: number;

  @Column({ type: 'int', nullable: true })
  retirement_age: number;

  @Column({ type: 'int', nullable: true })
  life_expectancy: number;

  @Column({ type: 'int', nullable: true })
  expected_inflation: number;

  @Column({ type: 'int', nullable: true })
  target_year: number;

  @Column({ type: 'int', nullable: true })
  expected_returns: number;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  @Column({ type: 'tinyint', default: 0 })
  is_deleted: number;
}
