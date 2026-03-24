import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'income_ranges' })
export class IncomeRange {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  income_range: string;

  @Column({ type: 'varchar', length: 150 })
  income_range_identifier: string;

  @Column({ type: 'varchar', length: 10 })
  code: string;
}
