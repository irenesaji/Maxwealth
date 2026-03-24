import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'address_types' })
export class AddressType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 10 })
  code: string;

  @Column({ type: 'varchar', length: 100 })
  communication_address_type: string;
}
