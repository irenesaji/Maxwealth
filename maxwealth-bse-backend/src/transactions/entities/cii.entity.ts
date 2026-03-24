import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('cost_inflation_index')
export class CostInflationIndex {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  financial_year: number;

  @Column()
  cost_inflation_index: number;
}
