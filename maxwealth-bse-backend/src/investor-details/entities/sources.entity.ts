import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { TransactionReports } from './transaction-details.entity';

@Entity('sources')
export class Source {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  transaction_report_id: number;

  @Column()
  source_transaction_id: number;

  @ManyToOne(
    () => TransactionReports,
    (transactionReport) => transactionReport.sources,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'transaction_report_id' })
  transactionReport: TransactionReports;

  @ManyToOne(
    () => TransactionReports,
    (transactionReport) => transactionReport.sources,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'source_transaction_id' })
  source_transaction: TransactionReports;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  gain: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  units: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  days_held: number;

  @Column({ type: 'decimal', precision: 10, scale: 4, nullable: true })
  purchased_at: number;

  @Column({ type: 'timestamp', nullable: true })
  purchased_on: Date;
}
