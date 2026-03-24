import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('kyc_status')
export class KycStatus {
  @PrimaryColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  status_description: string;
}
