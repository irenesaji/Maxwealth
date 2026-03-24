import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsDate,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class CreateTransactionReportDto {
  @IsNotEmpty()
  @IsString()
  amc_code: string;

  @IsNotEmpty()
  @IsString()
  folio_no: string;

  @IsNotEmpty()
  @IsString()
  prod_code: string;

  @IsNotEmpty()
  @IsString()
  scheme: string;

  @IsNotEmpty()
  @IsString()
  inv_name: string;

  @IsNotEmpty()
  @IsString()
  trxn_type: string;

  @IsNotEmpty()
  @IsString()
  trxn_no: string;

  @IsNotEmpty()
  @IsString()
  trxn_mode: string;

  @IsNotEmpty()
  @IsString()
  trxn_stat: string;

  @IsNotEmpty()
  @IsString()
  user_code: string;

  @IsNotEmpty()
  @IsString()
  usr_trx_no: string;

  @IsNotEmpty()
  @IsDate()
  trad_date: Date;

  @IsNotEmpty()
  @IsDate()
  post_date: Date;

  @IsNotEmpty()
  @IsNumber()
  pur_price: number;

  @IsNotEmpty()
  @IsNumber()
  units: number;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsOptional()
  @IsString()
  brok_code?: string;

  @IsOptional()
  @IsString()
  sub_brok?: string;

  @IsOptional()
  @IsNumber()
  brok_perc?: number;

  @IsOptional()
  @IsNumber()
  brok_comm?: number;

  @IsOptional()
  @IsString()
  alt_folio?: string;

  @IsOptional()
  @IsDate()
  rep_date?: Date;

  @IsOptional()
  @IsString()
  time1?: string;

  @IsOptional()
  @IsString()
  trxn_sub_typ?: string;

  @IsOptional()
  @IsString()
  applicatio?: string;

  @IsOptional()
  @IsString()
  trxn_natur?: string;

  @IsOptional()
  @IsNumber()
  tax?: number;

  @IsOptional()
  @IsNumber()
  total_tax?: number;

  @IsOptional()
  @IsString()
  te15h?: string;

  @IsOptional()
  @IsString()
  micr_no?: string;

  @IsOptional()
  @IsString()
  remarks?: string;

  @IsOptional()
  @IsString()
  sw_flag?: string;

  @IsOptional()
  @IsString()
  old_folio?: string;

  @IsOptional()
  @IsNumber()
  seq_no?: number;

  @IsOptional()
  @IsString()
  reinvest_f?: string;

  @IsOptional()
  @IsString()
  mult_brok?: string;

  @IsOptional()
  @IsNumber()
  stt?: number;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  scheme_typ?: string;

  @IsOptional()
  @IsString()
  tax_status?: string;

  @IsOptional()
  @IsNumber()
  load?: number;

  @IsOptional()
  @IsString()
  scan_ref_no?: string;

  @IsOptional()
  @IsString()
  pan?: string;

  @IsOptional()
  @IsString()
  inv_iin?: string;

  @IsOptional()
  @IsString()
  targ_src_s?: string;

  @IsOptional()
  @IsString()
  trxn_type_?: string;

  @IsOptional()
  @IsString()
  ticob_trty?: string;

  @IsOptional()
  @IsString()
  ticob_trno?: string;

  @IsOptional()
  @IsDate()
  ticob_post?: Date;

  @IsOptional()
  @IsString()
  dp_id?: string;

  @IsOptional()
  @IsNumber()
  trxn_charg?: number;

  @IsOptional()
  @IsNumber()
  eligib_amt?: number;

  @IsOptional()
  @IsString()
  src_of_txn?: string;

  @IsOptional()
  @IsString()
  trxn_suffi?: string;

  @IsOptional()
  @IsString()
  sip_trxn_no?: string;

  @IsOptional()
  @IsString()
  ter_locati?: string;

  @IsOptional()
  @IsString()
  euin?: string;

  @IsOptional()
  @IsBoolean()
  euin_valid?: boolean;

  @IsOptional()
  @IsBoolean()
  euin_opted?: boolean;

  @IsOptional()
  @IsString()
  sub_brk_ar?: string;

  @IsOptional()
  @IsString()
  exch_dc_fl?: string;

  @IsOptional()
  @IsString()
  src_brk_co?: string;

  @IsOptional()
  @IsDate()
  sys_regn_d?: Date;

  @IsOptional()
  @IsString()
  ac_no?: string;

  @IsOptional()
  @IsString()
  bank_name?: string;

  @IsOptional()
  @IsString()
  reversal_c?: string;

  @IsOptional()
  @IsString()
  exchange_f?: string;

  @IsOptional()
  @IsString()
  ca_initiat?: string;

  @IsOptional()
  @IsString()
  gst_state_?: string;

  @IsOptional()
  @IsNumber()
  igst_amount?: number;

  @IsOptional()
  @IsNumber()
  cgst_amount?: number;

  @IsOptional()
  @IsNumber()
  sgst_amount?: number;

  @IsOptional()
  @IsString()
  rev_remark?: string;

  @IsOptional()
  @IsString()
  original_t?: string;

  @IsOptional()
  @IsNumber()
  stamp_duty?: number;

  @IsOptional()
  @IsString()
  folio_old?: string;

  @IsOptional()
  @IsString()
  scheme_fol?: string;

  @IsOptional()
  @IsString()
  amc_ref_no?: string;

  @IsOptional()
  @IsString()
  request_re?: string;
}
