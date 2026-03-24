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
import { ModelPortfolioAssociatedFund } from './model_portfolio_associated_fund.entity';

@Entity({ name: 'model_portfolio_funds' })
export class ModelPortfolioFund {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 40 })
  scheme_isin: string;

  @Column({ length: 255 })
  scheme_name: string;

  @Column({ length: 255 })
  scheme_logo: string;

  @Column({ name: 'fund_plan_id' })
  fund_plan_id: number;

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

  // Define the relationship with the 'model_portfolios' table
  @ManyToOne(
    (type) => ModelPortfolio,
    (model_portfolio) => model_portfolio.model_portfolio_funds,
  )
  @JoinColumn({ name: 'model_portfolio_id' })
  model_portfolio: ModelPortfolio;

  @OneToOne(
    (type) => ModelPortfolioAssociatedFund,
    (model_portfolio_associated_fund) =>
      model_portfolio_associated_fund.model_portfolio_fund,
  )
  model_portfolio_associated_fund: ModelPortfolioAssociatedFund;
}
