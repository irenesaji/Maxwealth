import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('pennydrops')
export class Pennydrops {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, nullable: false })
  account_number: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  ifsc: string;

  @Column({ type: 'boolean', default: false })
  name_match_valid: boolean;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'boolean', default: false })
  is_bank_valid: boolean;
}
