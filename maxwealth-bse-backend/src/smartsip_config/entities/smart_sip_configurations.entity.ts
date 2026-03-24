import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('smart_sip_configuration')
export class SmartSipConfiguration {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 30, nullable: true })
  track_fund_isin: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  track_fund_attribute: string;

  @Column({ type: 'float', nullable: true })
  attribute_range_start: number;

  @Column({ type: 'float', nullable: true })
  attribute_range_end: number;

  @Column({ type: 'float', nullable: true })
  debt_scheme_allocation: number;

  @Column({ type: 'float', nullable: true })
  equity_scheme_allocation: number;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
