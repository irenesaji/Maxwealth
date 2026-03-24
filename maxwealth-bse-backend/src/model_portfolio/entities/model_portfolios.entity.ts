import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ModelPortfolioFund } from './model_portfolio_funds.entity';
import { Goal } from 'src/goals/entities/goals.entity';
import { RiskProfile } from 'src/risk_profiles/entities/risk_profiles.entity';

@Entity({ name: 'model_portfolios' })
export class ModelPortfolio {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 40 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  // Define the relationship with the 'model_portfolio_funds' table
  @OneToMany(
    (type) => ModelPortfolioFund,
    (model_portfolio_funds) => model_portfolio_funds.model_portfolio,
  )
  @JoinColumn({ name: 'model_portfolio_id' })
  model_portfolio_funds: ModelPortfolioFund[];

  @OneToMany((type) => Goal, (goals) => goals.model_portfolio)
  @JoinColumn({ name: 'model_portfolio_id' })
  goals: Goal[];

  @OneToMany(
    (type) => RiskProfile,
    (risk_profiles) => risk_profiles.model_portfolio,
  )
  @JoinColumn({ name: 'model_portfolio_id' })
  risk_profiles: RiskProfile[];
}
