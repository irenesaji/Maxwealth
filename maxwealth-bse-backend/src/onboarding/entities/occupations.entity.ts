import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'occupations' })
export class Occupation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 10 })
  code: string;

  @Column({ type: 'varchar', length: 100 })
  occupation_description: string;

  @Column({ type: 'varchar', length: 150 })
  occupation_identifier: string;

  @Column({ type: 'varchar', length: 10 })
  karvy_occupation_code: string;

  @Column({ type: 'varchar', length: 200 })
  karvy_occupation_description: string;

  @Column({ type: 'varchar', length: 200 })
  karvy_occupation_identifier: string;
}
