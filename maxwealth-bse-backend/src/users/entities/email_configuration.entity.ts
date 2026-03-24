import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class EmailConfiguration {
  @PrimaryColumn()
  id: number;

  @Column('json')
  key_json: Record<string, any>;

  @Column()
  provider: string;
}
