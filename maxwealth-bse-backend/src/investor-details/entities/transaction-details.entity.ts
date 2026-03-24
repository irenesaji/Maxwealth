import { Users } from 'src/users/entities/users.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Source } from './sources.entity';
import { Fileprocess } from 'src/fileprocess/entities/fileprocess.entity';

@Entity('transaction_reports')
export class TransactionReports {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column()
  user_id: number;

  @Column()
  file_processed_id: number;

  @Column()
  user_pan: string;

  @Column()
  is_processed: boolean;

  @Column({ type: 'bigint', nullable: true })
  units_left: number;

  @Column({ type: 'varchar', length: 255 })
  object: string;

  @Column({ type: 'varchar', length: 20, nullable: false })
  folio_number: string;

  @Column({ type: 'varchar', length: 12, nullable: false })
  isin: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  type: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  amount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  units: number;

  @Column({ type: 'date', nullable: false })
  traded_on: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  traded_at: number;

  @Column({ type: 'varchar', nullable: true })
  order?: string;

  @Column({ type: 'varchar', nullable: true })
  corporate_action?: string;

  @Column({ type: 'bigint', nullable: true })
  related_transaction_id?: number;

  @Column({ type: 'varchar', length: 20, nullable: false })
  rta_order_reference: string;

  @Column({ type: 'varchar', length: 20, nullable: false })
  usr_trx_no: string;

  @Column({ type: 'varchar', length: 20, nullable: false })
  rta_product_code: string;

  @Column({ type: 'varchar', length: 20, nullable: false })
  rta_investment_option: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  rta_scheme_name: string;

  @ManyToOne(() => Users, (user) => user.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  users: Users | null;

  @ManyToOne(() => Fileprocess, (file) => file.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'file_processed_id' })
  file_processed: Fileprocess;

  @OneToMany(() => Source, (source) => source.transactionReport)
  sources: Source;

  @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
