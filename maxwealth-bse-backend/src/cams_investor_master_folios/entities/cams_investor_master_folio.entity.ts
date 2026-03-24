import { Users } from 'src/users/entities/users.entity';
import {
  Column,
  CreateDateColumn,
  Decimal128,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('cams_investor_master_folios')
export class CamsInvestorMasterFolios {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  folio: string;

  @Column({ length: 100 })
  inv_name: string;

  @Column({ length: 100, nullable: true })
  address1: string;

  @Column({ length: 100, nullable: true })
  address2: string;

  @Column({ length: 100, nullable: true })
  address3: string;

  @Column({ length: 100, nullable: true })
  city: string;

  @Column({ length: 50, nullable: true })
  pincode: string;

  @Column({ length: 200 })
  product: string;

  @Column({ length: 100 })
  sch_name: string;

  @Column({ type: 'date', nullable: true })
  rep_date: Date;

  @Column({ type: 'float', nullable: true })
  clos_bal: number;

  @Column({ type: 'float', nullable: true })
  rupee_bal: number;

  @Column({ length: 100, nullable: true })
  jnt_name1: string;

  @Column({ length: 100, nullable: true })
  jnt_name2: string;

  @Column({ length: 20, nullable: true })
  phone_off: string;

  @Column({ length: 20, nullable: true })
  phone_res: string;

  @Column({ length: 100, nullable: true })
  email: string;

  @Column({ length: 100, nullable: true })
  holding_nature: string;

  @Column({ length: 100, nullable: true })
  uin_no: string;

  @Column({ length: 20, nullable: true })
  pan_no: string;

  @Column({ length: 100, nullable: true })
  joint1_pan: string;

  @Column({ length: 100, nullable: true })
  joint2_pan: string;

  @Column({ length: 100, nullable: true })
  guard_pan: string;

  @Column({ length: 100, nullable: true })
  tax_status: string;

  @Column({ length: 100, nullable: true })
  broker_code: string;

  @Column({ length: 100, nullable: true })
  subbroker: string;

  @Column({ length: 50, nullable: true })
  reinv_flag: string;

  @Column({ length: 100, nullable: true })
  bank_name: string;

  @Column({ length: 100, nullable: true })
  branch: string;

  @Column({ length: 100, nullable: true })
  ac_type: string;

  @Column({ length: 100, nullable: true })
  ac_no: string;

  @Column({ length: 100, nullable: true })
  b_address1: string;

  @Column({ length: 100, nullable: true })
  b_address2: string;

  @Column({ length: 100, nullable: true })
  b_address3: string;

  @Column({ length: 100, nullable: true })
  b_city: string;

  @Column({ length: 50, nullable: true })
  b_pincode: string;

  @Column({ type: 'date', nullable: true })
  inv_dob: Date;

  @Column({ length: 20, nullable: true })
  mobile_no: string;

  @Column({ length: 100, nullable: true })
  occupation: string;

  @Column({ length: 100, nullable: true })
  inv_iin: string;

  @Column({ length: 100, nullable: true })
  nom_name: string;

  @Column({ length: 100, nullable: true })
  relation: string;

  @Column({ length: 100, nullable: true })
  nom_addr1: string;

  @Column({ length: 100, nullable: true })
  nom_addr2: string;

  @Column({ length: 100, nullable: true })
  nom_addr3: string;

  @Column({ length: 100, nullable: true })
  nom_city: string;

  @Column({ length: 100, nullable: true })
  nom_state: string;

  @Column({ length: 20, nullable: true })
  nom_pincode: string;

  @Column({ length: 100, nullable: true })
  nom_ph_off: string;

  @Column({ length: 100, nullable: true })
  nom_ph_res: string;

  @Column({ length: 100, nullable: true })
  nom_email: string;

  @Column('decimal', { scale: 5, precision: 2 })
  nom_percentage: number;

  @Column({ length: 100, nullable: true })
  nom2_name: string;

  @Column({ length: 100, nullable: true })
  nom2_relation: string;

  @Column({ length: 100, nullable: true })
  nom2_addr1: string;

  @Column({ length: 100, nullable: true })
  nom2_addr2: string;

  @Column({ length: 100, nullable: true })
  nom2_addr3: string;

  @Column({ length: 100, nullable: true })
  nom2_city: string;

  @Column({ length: 100, nullable: true })
  nom2_state: string;

  @Column({ length: 20, nullable: true })
  nom2_pincode: string;

  @Column({ length: 100, nullable: true })
  nom2_ph_off: string;

  @Column({ length: 100, nullable: true })
  nom2_ph_res: string;

  @Column({ length: 100, nullable: true })
  nom2_email: string;

  @Column('decimal', { scale: 5, precision: 2 })
  nom2_percentage: number;

  @Column({ length: 100, nullable: true })
  nom3_name: string;

  @Column({ length: 100, nullable: true })
  nom3_relation: string;

  @Column({ length: 100, nullable: true })
  nom3_addr1: string;

  @Column({ length: 100, nullable: true })
  nom3_addr2: string;

  @Column({ length: 100, nullable: true })
  nom3_addr3: string;

  @Column({ length: 100, nullable: true })
  nom3_city: string;

  @Column({ length: 100, nullable: true })
  nom3_state: string;

  @Column({ length: 20, nullable: true })
  nom3_pincode: string;

  @Column({ length: 100, nullable: true })
  nom3_ph_off: string;

  @Column({ length: 100, nullable: true })
  nom3_ph_res: string;

  @Column({ length: 100, nullable: true })
  nom3_email: string;

  @Column('decimal', { scale: 5, precision: 2 })
  nom3_percentage: number;

  @Column({ length: 100, nullable: true })
  ifsc_code: string;

  @Column({ length: 100, nullable: true })
  dp_id: string;

  @Column({ length: 100, nullable: true })
  demat: string;

  @Column({ length: 100, nullable: true })
  guard_name: string;

  @Column({ length: 100, nullable: true })
  brokcode: string;

  @Column({ type: 'date', nullable: true })
  folio_date: Date;

  @Column({ length: 100, nullable: true })
  aadhaar: string;

  @Column({ length: 100, nullable: true })
  tpa_linked: string;

  @Column({ length: 100, nullable: true })
  fh_ckyc_no: string;

  @Column({ length: 100, nullable: true })
  jh1_ckyc: string;

  @Column({ length: 100, nullable: true })
  jh2_ckyc: string;

  @Column({ length: 100, nullable: true })
  g_ckyc_no: string;

  @Column({ type: 'date', nullable: true })
  jh1_dob: Date;

  @Column({ type: 'date', nullable: true })
  jh2_dob: Date;

  @Column({ type: 'date', nullable: true })
  guardian_dob: Date;

  @Column({ length: 100, nullable: true })
  amc_code: string;

  @Column()
  gst_state_code: number;

  @Column({ length: 100, nullable: true })
  folio_old: string;

  @Column({ length: 100, nullable: true })
  scheme_folio_number: string;

  @Column()
  is_deleted: boolean;

  @ManyToOne(() => Users, (user) => user.camsInvestorMasterFolios, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
