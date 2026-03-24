import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('blocked_ips')
export class BlockedIp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  ip: string;

  @CreateDateColumn()
  createdAt: Date;
}
