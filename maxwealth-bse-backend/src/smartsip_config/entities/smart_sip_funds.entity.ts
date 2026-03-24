import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class SmartSipFunds {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 40, nullable: true })
  equity_scheme_isin: string;

  @Column({ length: 255, nullable: true })
  equity_scheme_logo: string;

  @Column({ length: 255 })
  equity_scheme_name: string;

  @Column({ length: 255 })
  equity_scheme_category: string;

  @Column({ length: 255 })
  equity_scheme_asset_class: string;

  @Column({ length: 40, nullable: true })
  debt_scheme_isin: string;

  @Column({ length: 255, nullable: true })
  debt_scheme_logo: string;

  @Column({ length: 255 })
  debt_scheme_name: string;

  @Column({ length: 255 })
  debt_scheme_category: string;

  @Column({ length: 255 })
  debt_scheme_asset_class: string;

  @Column()
  debt_scheme_allocation: number;

  @Column()
  equity_scheme_allocation: number;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;
}
