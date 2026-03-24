import { ModelPortfolio } from 'src/model_portfolio/entities/model_portfolios.entity';
import { Users } from 'src/users/entities/users.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

@Entity('risk_profiles')
export class RiskProfile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'float' })
  low: number;

  @Column({ type: 'float' })
  high: number;

  @Column({ default: true })
  is_active: boolean;

  @Column()
  display_equity_allocation: string;

  @Column({ type: 'float' })
  min_equity_allocation: number;

  @Column({ type: 'float' })
  max_equity_allocation: number;

  @Column()
  display_debt_allocation: string;

  @Column({ type: 'float' })
  min_debt_allocation: number;

  @Column({ type: 'float' })
  max_debt_allocation: number;

  @Column()
  display_liquid_allocation: string;

  @Column({ type: 'float' })
  min_liquid_allocation: number;

  @Column({ type: 'float' })
  max_liquid_allocation: number;

  @Column()
  model_portfolio_id: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  // Define the relationship with the 'model_portfolios' table
  @ManyToOne(
    (type) => ModelPortfolio,
    (model_portfolio) => model_portfolio.risk_profiles,
  )
  @JoinColumn({ name: 'model_portfolio_id' })
  model_portfolio: ModelPortfolio | null;

  @OneToMany((type) => Users, (users) => users.risk_profile)
  @JoinColumn({ name: 'risk_profile_id' })
  users: Users;
}
