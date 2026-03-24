import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('cost_inflation_index')
export class CostInflationIndex {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  financial_year: number;

  @Column({ type: 'int' })
  cost_inflation_index: number;
}
