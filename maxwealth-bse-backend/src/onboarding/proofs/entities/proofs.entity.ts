import { Users } from 'src/users/entities/users.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';

@Entity('proofs')
export class Proofs {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;

  @Column()
  document_type: string;

  @Column()
  fp_front_document_url: string;

  @Column()
  fp_back_document_url: string;

  @Column()
  front_document_path: string;

  @Column()
  back_document_path: string;

  @Column()
  document_id_number: string;

  @Column()
  fp_front_side_file_id: string;

  @Column()
  fp_back_side_file_id: string;

  @Column()
  user_id: number;

  @OneToOne(() => Users)
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @Column()
  proof_issue_date: Date;

  @Column()
  proof_expiry_date: Date;

  @Column()
  created_at: Date;

  @Column()
  updated_at: Date;
}
