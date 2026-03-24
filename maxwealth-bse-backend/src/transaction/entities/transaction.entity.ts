import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Users } from 'src/users/entities/users.entity';

@Entity('transaction')
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  folio_number: string;

  @Column({ length: 255 })
  isin: string;

  @Column({ length: 50, nullable: true })
  type: string;

  @Column({ type: 'float', nullable: true })
  amount: number;

  @Column({ type: 'float', nullable: true })
  units: number;

  @Column({ type: 'date', nullable: true })
  traded_on: Date;

  @Column()
  traded_at: number;

  @Column({ length: 255, nullable: true })
  order: string;

  @Column({ length: 255, nullable: true })
  corporate_action: string;

  @Column({ type: 'int', nullable: true })
  related_transaction_id: number;

  @Column({ length: 255, nullable: true })
  rta_order_reference: string;

  @Column({ length: 255, nullable: true })
  rta_product_code: string;

  @Column({ length: 255, nullable: true })
  rta_investment_option: string;

  @Column({ length: 255, nullable: true })
  rta_scheme_name: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Users)
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @Column({ length: 255, nullable: true })
  rta: string;
}
