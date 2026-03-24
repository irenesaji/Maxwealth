import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Users } from 'src/users/entities/users.entity';

@Entity('notifications')
export class Notifications {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  user_id: number;

  @Column({ name: 'is_read' })
  is_read: boolean;

  @Column({ nullable: true, length: 256 })
  icon: string | null;

  @Column({ length: 256 })
  title: string;

  @Column({ type: 'text' })
  body: string;

  @ManyToOne(() => Users, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: Users;
}
