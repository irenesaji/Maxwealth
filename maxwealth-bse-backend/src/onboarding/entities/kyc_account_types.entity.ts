import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'kyc_account_types' })
export class KycAccountType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 10 })
  kyc_acc_code: string;

  @Column({ type: 'varchar', length: 100 })
  kyc_acc_description: string;
}
