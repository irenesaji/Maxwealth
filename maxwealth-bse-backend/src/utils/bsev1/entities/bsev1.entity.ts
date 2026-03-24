import { Column, Entity, PrimaryColumn } from 'typeorm';

export class Bsev1 {}

@Entity({ name: 'bse_v1_relationship_codes' })
export class Bsev1NomineeRelationshipCode {
  @PrimaryColumn()
  id: number;

  @Column()
  code: string;

  @Column()
  value: string;
}

@Entity({ name: 'bsev1_emandate_bank_code' })
export class Bsev1EmandateBankCode {
  @PrimaryColumn()
  id: number;

  @Column()
  pay_mode: string;

  @Column()
  bank_name: string;

  @Column()
  bank_id: string;

  @Column()
  merged_bank_id: string;
}

@Entity({ name: 'bsev1_upi_banks_code' })
export class Bsev1UpiBankCode {
  @PrimaryColumn()
  id: number;

  @Column()
  pay_mode: string;

  @Column()
  bank_name: string;

  @Column()
  bank_code: string;
}
