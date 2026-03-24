import { ModelPortfolio } from 'src/model_portfolio/entities/model_portfolios.entity';
import {
  Entity,
  PrimaryColumn,
  Column,
  BaseEntity,
  ManyToOne,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'goals' })
export class Goal {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 40 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ length: 255 })
  icon: string;

  @Column()
  model_portfolio_id: number;

  // Define the relationship with the 'model_portfolios' table
  @ManyToOne(
    (type) => ModelPortfolio,
    (model_portfolio) => model_portfolio.goals,
  )
  @JoinColumn({ name: 'model_portfolio_id' })
  model_portfolio: ModelPortfolio | null;
}
