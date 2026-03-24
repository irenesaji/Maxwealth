import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('rzp_customers')
export class RzpCustomer {
  @PrimaryColumn({ type: 'varchar', length: 50 })
  id: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  email: string;

  @Column({ type: 'varchar', length: 15, nullable: true })
  contact: string;

  @Column({ type: 'varchar', length: 15, nullable: true })
  gstin: string;

  @Column({ type: 'json', nullable: true })
  notes: Record<string, any>;

  @Column({ type: 'bigint', nullable: true })
  created_at: number;
}
