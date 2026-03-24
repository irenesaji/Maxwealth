import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';

@Entity('file_processed')
export class Fileprocess {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  file_name: string;

  @Column({ type: 'boolean', default: false })
  is_processed: boolean;
}
