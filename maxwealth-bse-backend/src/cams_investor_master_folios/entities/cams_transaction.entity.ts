import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('cams_transaction_details')
export class CamsTransactionDetails {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  amc_code: string;

  @Column({ type: 'varchar', length: 255 })
  folio_no: string;

  @Column({ type: 'varchar', length: 255 })
  prod_code: string;

  @Column({ type: 'varchar', length: 255 })
  scheme: string;

  @Column({ type: 'varchar', length: 255 })
  inv_name: string;

  @Column({ type: 'varchar', length: 255 })
  trxn_type: string;

  @Column({ type: 'varchar', length: 255 })
  trxn_no: string;

  @Column({ type: 'varchar', length: 255 })
  trxn_mode: string;

  @Column({ type: 'varchar', length: 255 })
  trxn_stat: string;

  @Column({ type: 'varchar', length: 255 })
  user_code: string;

  @Column({ type: 'varchar', length: 255 })
  usr_trx_no: string;

  @Column({ type: 'date' })
  trad_date: Date;

  @Column({ type: 'date' })
  post_date: Date;

  @Column({ type: 'decimal', precision: 18, scale: 2 })
  pur_price: number;

  @Column({ type: 'decimal', precision: 18, scale: 2 })
  units: number;

  @Column({ type: 'decimal', precision: 18, scale: 2 })
  amount: number;

  @Column({ type: 'varchar', length: 255 })
  brok_code: string;

  @Column({ type: 'varchar', length: 255 })
  sub_brok: string;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  brok_perc: number;

  @Column({ type: 'decimal', precision: 18, scale: 2 })
  brok_comm: number;

  @Column({ type: 'varchar', length: 255 })
  alt_folio: string;

  @Column({ type: 'date' })
  rep_date: Date;

  @Column({ type: 'varchar', length: 255 })
  time1: string;

  @Column({ type: 'varchar', length: 255 })
  trxn_sub_typ: string;

  @Column({ type: 'varchar', length: 255 })
  applicatio: string;

  @Column({ type: 'varchar', length: 255 })
  trxn_natur: string;

  @Column({ type: 'decimal', precision: 18, scale: 2 })
  tax: number;

  @Column({ type: 'decimal', precision: 18, scale: 2 })
  total_tax: number;

  @Column({ type: 'varchar', length: 255 })
  te15h: string;

  @Column({ type: 'varchar', length: 255 })
  micr_no: string;

  @Column({ type: 'varchar', length: 255 })
  remarks: string;

  @Column({ type: 'varchar', length: 255 })
  sw_flag: string;

  @Column({ type: 'varchar', length: 255 })
  old_folio: string;

  @Column({ type: 'bigint' })
  seq_no: number;

  @Column({ type: 'varchar', length: 255 })
  reinvest_f: string;

  @Column({ type: 'varchar', length: 255 })
  mult_brok: string;

  @Column({ type: 'decimal', precision: 18, scale: 2 })
  stt: number;

  @Column({ type: 'varchar', length: 255 })
  location: string;

  @Column({ type: 'varchar', length: 255 })
  scheme_typ: string;

  @Column({ type: 'varchar', length: 255 })
  tax_status: string;

  @Column({ type: 'decimal', precision: 18, scale: 2 })
  load: number;

  @Column({ type: 'varchar', length: 255 })
  scan_ref_no: string;

  @Column({ type: 'varchar', length: 255 })
  pan: string;

  @Column({ type: 'varchar', length: 255 })
  inv_iin: string;

  @Column({ type: 'varchar', length: 255 })
  targ_src_s: string;

  @Column({ type: 'varchar', length: 255 })
  trxn_type_: string;

  @Column({ type: 'varchar', length: 255 })
  ticob_trty: string;

  @Column({ type: 'varchar', length: 255 })
  ticob_trno: string;

  @Column({ type: 'date' })
  ticob_post: Date;

  @Column({ type: 'varchar', length: 255 })
  dp_id: string;

  @Column({ type: 'decimal', precision: 18, scale: 2 })
  trxn_charg: number;

  @Column({ type: 'decimal', precision: 18, scale: 2 })
  eligib_amt: number;

  @Column({ type: 'varchar', length: 255 })
  src_of_txn: string;

  @Column({ type: 'varchar', length: 255 })
  trxn_suffi: string;

  @Column({ type: 'varchar', length: 255 })
  sip_trxn_no: string;

  @Column({ type: 'varchar', length: 255 })
  ter_locati: string;

  @Column({ type: 'varchar', length: 255 })
  euin: string;

  @Column({ type: 'boolean' })
  euin_valid: boolean;

  @Column({ type: 'boolean' })
  euin_opted: boolean;

  @Column({ type: 'varchar', length: 255 })
  sub_brk_ar: string;

  @Column({ type: 'varchar', length: 255 })
  exch_dc_fl: string;

  @Column({ type: 'varchar', length: 255 })
  src_brk_co: string;

  @Column({ type: 'date' })
  sys_regn_d: Date;

  @Column({ type: 'varchar', length: 255 })
  ac_no: string;

  @Column({ type: 'varchar', length: 255 })
  bank_name: string;

  @Column({ type: 'varchar', length: 255 })
  reversal_c: string;

  @Column({ type: 'varchar', length: 255 })
  exchange_f: string;

  @Column({ type: 'varchar', length: 255 })
  ca_initiat: string;

  @Column({ type: 'varchar', length: 255 })
  gst_state_: string;

  @Column({ type: 'decimal', precision: 18, scale: 2 })
  igst_amount: number;

  @Column({ type: 'decimal', precision: 18, scale: 2 })
  cgst_amount: number;

  @Column({ type: 'decimal', precision: 18, scale: 2 })
  sgst_amount: number;

  @Column({ type: 'varchar', length: 255 })
  rev_remark: string;

  @Column({ type: 'varchar', length: 255 })
  original_t: string;

  @Column({ type: 'decimal', precision: 18, scale: 2 })
  stamp_duty: number;

  @Column({ type: 'varchar', length: 255 })
  folio_old: string;

  @Column({ type: 'varchar', length: 255 })
  scheme_fol: string;

  @Column({ type: 'varchar', length: 255 })
  amc_ref_no: string;

  @Column({ type: 'varchar', length: 255 })
  request_re: string;
}
