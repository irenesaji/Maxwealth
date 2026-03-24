import { Users } from 'src/users/entities/users.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('kfintech_investor_master_folios')
export class KfintechInvestorMasterFolios {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column()
  product_code: string;

  @Column()
  fund: string;

  @Column()
  folio: string;

  @Column()
  fund_description: string;

  @Column()
  investor_name: string;

  @Column()
  joint_name_1: string;

  @Column()
  joint_name_2: string;

  @Column()
  address_1: string;

  @Column()
  address_2: string;

  @Column()
  address_3: string;

  @Column()
  city: string;

  @Column()
  pincode: string;

  @Column()
  state: string;

  @Column()
  country: string;

  @Column()
  tpin: string;

  @Column({ type: 'date' })
  date_of_birth: Date;

  @Column()
  f_name: string;

  @Column()
  m_name: string;

  @Column()
  phone_residence: string;

  @Column()
  phone_res_1: string;

  @Column()
  phone_res_2: string;

  @Column()
  phone_office: string;

  @Column()
  phone_off_1: string;

  @Column()
  phone_off_2: string;

  @Column()
  fax_residence: string;

  @Column()
  fax_office: string;

  @Column()
  tax_status: string;

  @Column()
  occ_code: number;

  @Column()
  email: string;

  @Column()
  bank_acc_no: string;

  @Column()
  bank_name: string;

  @Column()
  account_type: string;

  @Column()
  branch: string;

  @Column()
  bank_address_1: string;

  @Column()
  bank_address_2: string;

  @Column()
  bank_address_3: string;

  @Column()
  bank_city: string;

  @Column()
  bank_phone: string;

  @Column()
  bank_state: string;

  @Column()
  bank_country: string;

  @Column()
  investor_id: string;

  @Column()
  broker_code: string;

  @Column({ type: 'date' })
  report_date: Date;

  @Column({ type: 'time' })
  report_time: string;

  @Column()
  pan_number: string;

  @Column()
  mobile_number: string;

  @Column()
  dividend_option: string;

  @Column()
  occupation_description: string;

  @Column()
  mode_of_holding_description: string;

  @Column()
  mapin_id: string;

  @Column()
  pan_2: string;

  @Column()
  pan_3: string;

  @Column()
  category: number;

  @Column()
  guardian_name: string;

  @Column()
  nominee: string;

  @Column()
  client_id: string;

  @Column()
  dpid: string;

  @Column()
  category_desc: string;

  @Column()
  status_desc: string;

  @Column()
  ifsc_code: string;

  @Column()
  nominee_2: string;

  @Column()
  nominee_3: string;

  @Column()
  kyc_1_flag: string;

  @Column()
  kyc_2_flag: string;

  @Column()
  kyc_3_flag: string;

  @Column()
  guard_pan_no: string;

  @Column({ type: 'date' })
  last_updated_date: Date;

  @Column()
  common_acc_no: string;

  @Column()
  nominee_relation: string;

  @Column()
  nominee_2_relation: string;

  @Column()
  nominee_3_relation: string;

  @Column()
  nominee_ratio: number;

  @Column()
  nominee_2_ratio: number;

  @Column()
  nominee_3_ratio: number;

  @Column()
  holder_1_aadhaar_info: string;

  @Column()
  holder_2_aadhaar_info: string;

  @Column()
  holder_3_aadhaar_info: string;

  @Column()
  guardian_aadhaar_info: string;

  @Column()
  nominee_address_1: string;

  @Column()
  nominee_address_2: string;

  @Column()
  nominee_address_3: string;

  @Column()
  nominee_city: string;

  @Column()
  nominee_state: string;

  @Column()
  nominee_pincode: string;

  @Column()
  nominee_phone_residence: string;

  @Column()
  nominee_email: string;

  @Column()
  nominee_2_address_1: string;

  @Column()
  nominee_2_address_2: string;

  @Column()
  nominee_2_address_3: string;

  @Column()
  nominee_2_city: string;

  @Column()
  nominee_2_state: string;

  @Column()
  nominee_2_pincode: string;

  @Column()
  nominee_2_phone_residence: string;

  @Column()
  nominee_2_email: string;

  @Column()
  nominee_3_address_1: string;

  @Column()
  nominee_3_address_2: string;

  @Column()
  nominee_3_address_3: string;

  @Column()
  nominee_3_city: string;

  @Column()
  nominee_3_state: string;

  @Column()
  nominee_3_pincode: string;

  @Column()
  nominee_3_phone_residence: string;

  @Column()
  nominee_3_email: string;

  @Column()
  ckyc_no: string;

  @Column()
  jh1_ckyc: string;

  @Column()
  jh2_ckyc: string;

  @Column()
  guardian_ckyc_no: string;

  @Column()
  joint_holder_1st_resi_phone_no: string;

  @Column()
  joint_holder_2nd_resi_phone_no: string;

  @Column()
  investors_resi_fax_no: string;

  @Column()
  kyc_g_flag: string;

  @Column()
  demat_folio_flag: string;

  @Column()
  nominee_opt_out_flag: string;

  @Column({ type: 'date' })
  nominee_dob: Date;

  @Column()
  joint_holder_1_contact_number: string;

  @Column()
  joint_holder_1_email_id: string;

  @Column()
  joint_holder_2_contact_number: string;

  @Column()
  joint_holder_2_email_id: string;

  @Column()
  nominee_guardian_name: string;

  @Column()
  email_concern: string;

  @Column()
  email_relationship: string;

  @Column()
  mobile_relationship: string;

  @Column()
  ubo_flag: string;

  @Column()
  npo_flag: string;

  @Column()
  is_deleted: boolean;

  @ManyToOne(() => Users, (user) => user.kfintechInvestorMasterFolios, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
