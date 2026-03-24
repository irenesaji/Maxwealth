import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { ModelPortfolio } from './model_portfolios.entity';
import { ModelPortfolioFund } from './model_portfolio_funds.entity';

@Entity({ name: 'model_portfolio_associated_funds' })
export class ModelPortfolioAssociatedFund {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 40 })
  scheme_isin: string;

  @Column({ length: 255 })
  scheme_name: string;

  @Column({ length: 255 })
  scheme_logo: string;

  @Column({ length: 255 })
  scheme_category: string;

  @Column({ length: 255 })
  scheme_asset_class: string;

  @Column({ type: 'float' })
  allocation_percentage: number;

  @Column()
  priority: number;

  @Column({ name: 'model_portfolio_id' })
  model_portfolio_id: number;

  @Column({ name: 'model_portfolio_fund_id' })
  model_portfolio_fund_id: number;

  @Column({ name: 'fund_plan_id' })
  fund_plan_id: number;

  // Define the relationship with the 'model_portfolios' table
  @ManyToOne(
    (type) => ModelPortfolio,
    (model_portfolio) => model_portfolio.model_portfolio_funds,
  )
  @JoinColumn({ name: 'model_portfolio_id' })
  model_portfolio: ModelPortfolio;

  @OneToOne(
    (type) => ModelPortfolioFund,
    (model_portfolio_fund) =>
      model_portfolio_fund.model_portfolio_associated_fund,
  )
  @JoinColumn({ name: 'model_portfolio_fund_id' })
  model_portfolio_fund: ModelPortfolioFund;
}
