import {
  IsString,
  IsOptional,
  IsDateString,
  IsNumber,
  IsBoolean,
} from 'class-validator';

export class CreateKfintechTransactionMasterFolioDto {
  @IsString()
  FMCODE: string;

  @IsString()
  TD_FUND: string;

  @IsString()
  TD_ACNO: string;

  @IsString()
  SCHPLN: string;

  @IsString()
  FUNDDESC: string;

  @IsString()
  TD_PURRED: string;

  @IsString()
  TD_TRNO: string;

  @IsString()
  SMCODE: string;

  @IsString()
  @IsOptional()
  CHQNO?: string;

  @IsString()
  INVNAME: string;

  @IsString()
  TRNMODE: string;

  @IsString()
  TRNSTAT: string;

  @IsString()
  TD_BRANCH: string;

  @IsString()
  ISCTRNO: string;

  @IsDateString()
  TD_TRDT: Date;

  @IsDateString()
  TD_PRDT: Date;

  @IsNumber()
  TD_POP: number;

  @IsNumber()
  TD_UNITS: number;

  @IsNumber()
  TD_AMT: number;

  @IsString()
  TD_AGENT: string;

  @IsString()
  TD_BROKER: string;

  @IsNumber()
  BROKPER: number;

  @IsNumber()
  BROKCOMM: number;

  @IsString()
  INVID: string;

  @IsDateString()
  CRDATE: Date;

  @IsString()
  CRTIME: string;

  @IsString()
  TRNSUB: string;

  @IsString()
  TD_APPNO: string;

  @IsString()
  UNQNO: string;

  @IsString()
  TRDESC: string;

  @IsString()
  TD_TRTYPE: string;

  @IsDateString()
  @IsOptional()
  CHQDATE?: Date;

  @IsString()
  CHQBANK: string;

  @IsString()
  DIVOPT: string;

  @IsString()
  TRFLAG: string;

  @IsNumber()
  TD_NAV: number;

  @IsNumber()
  STT: number;

  @IsNumber()
  LOAD1: number;

  @IsString()
  IHNO: string;

  @IsString()
  BRANCHCODE: string;

  @IsString()
  INWARDNUM0: string;

  @IsString()
  PAN1: string;

  @IsString()
  NCTREMARKS: string;

  @IsDateString()
  NAVDATE: Date;

  @IsString()
  PAN2: string;

  @IsString()
  PAN3: string;

  @IsNumber()
  TDSAMOUNT: number;

  @IsString()
  SCH1: string;

  @IsString()
  PLN1: string;

  @IsString()
  PRCODE1: string;

  @IsString()
  TD_TRXNMO1: string;

  @IsString()
  CLIENTID: string;

  @IsString()
  DPID: string;

  @IsString()
  STATUS: string;

  @IsString()
  REJTRNOOR2: string;

  @IsString()
  SUBTRTYPE: string;

  @IsNumber()
  TRCHARGES: number;

  @IsString()
  ATMCARDST3: string;

  @IsString()
  ATMCARDRE4: string;

  @IsDateString()
  BROK_ENTDT: Date;

  @IsString()
  SCHEMEISIN: string;

  @IsString()
  CITYCATEG5: string;

  @IsDateString()
  PORTDT: Date;

  @IsString()
  NEWUNQNO: string;

  @IsString()
  EUIN: string;

  @IsString()
  SUBARNCODE: string;

  @IsString()
  EVALID: string;

  @IsBoolean()
  EDECLFLAG: boolean;

  @IsString()
  ASSETTYPE: string;

  @IsDateString()
  SIPREGDT: Date;

  @IsString()
  TD_SCHEME: string;

  @IsString()
  TD_PLAN: string;

  @IsNumber()
  INSAMOUNT: number;

  @IsNumber()
  BROK_VALU6: number;

  @IsNumber()
  DIVPER: number;

  @IsString()
  CAN: string;

  @IsString()
  EXCHORGTR7: string;

  @IsString()
  ELECTRXNF8: string;

  @IsString()
  SIPREGSLNO: string;

  @IsBoolean()
  CLEARED: boolean;

  @IsString()
  INVSTATE: string;

  @IsNumber()
  STAMPDUTY: number;

  @IsString()
  FEEDTYPE: string;
}
