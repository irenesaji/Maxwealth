import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('unique_reference_no')
export class UniqueReferenceNo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  unique_number: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
