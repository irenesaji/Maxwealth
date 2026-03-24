import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'state_and_codes' })
export class StateAndCode {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  state: string;

  @Column({ type: 'varchar', length: 50 })
  cams_code: string;

  @Column({ type: 'varchar', length: 50 })
  voters_code: string;
}
