import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class SmsConfiguration {
  @PrimaryColumn()
  id: number;

  @Column('json')
  keys_json: Record<string, any>;

  @Column()
  provider: string;
}
