import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Users } from '../../users/entities/users.entity'; // Import the User entity
import { TransactionBasketItems } from './transaction_basket_items.entity'; // Import the TransactionBasketItem entity

@Entity({ name: 'skip_instructions' })
export class SkipInstruction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column()
  transaction_basket_item_id: number;

  @Column({ length: 100 })
  fp_id: string;

  @Column({ length: 100 })
  plan: string;

  @Column({ length: 100 })
  state: string;

  @Column({ length: 100 })
  from: string;

  @Column({ length: 100 })
  to: string;

  @Column()
  remaining_installments: number;

  @Column()
  skipped_installments: number;

  @Column({ type: 'datetime', nullable: true })
  cancelled_at: Date;

  @Column({ type: 'datetime', nullable: true })
  completed_at: Date;

  @ManyToOne(() => Users, (user) => user.skipInstructions)
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @ManyToOne(() => TransactionBasketItems, (item) => item.skip_instructions)
  @JoinColumn({ name: 'transaction_basket_item_id' })
  transaction_basket_item: TransactionBasketItems;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;
}
