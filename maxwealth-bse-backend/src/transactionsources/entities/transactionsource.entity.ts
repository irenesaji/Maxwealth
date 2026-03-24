import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Users } from 'src/users/entities/users.entity';
import { Transaction } from 'src/transaction/entities/transaction.entity';

@Entity('transaction_sources')
export class TransactionSource {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Transaction)
  @JoinColumn({ name: 'transaction_id' })
  transaction: Transaction;

  @ManyToOne(() => Users, (user) => user)
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @Column({ type: 'int', nullable: true })
  daysHeld: number;

  @Column()
  units: number;

  @Column({ type: 'date', nullable: true })
  purchasedOn: Date;

  @Column({ type: 'time', nullable: true })
  purchasedAt: string;

  @Column()
  gain: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
