import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('kfintech_transaction_master_folios')
export class KfintechTransactionMasterFolios {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  FMCODE: string;

  @Column({ nullable: true })
  TD_FUND: string;

  @Column({ nullable: true })
  TD_ACNO: string;

  @Column({ nullable: true })
  SCHPLN: string;

  @Column({ nullable: true })
  FUNDDESC: string;

  @Column({ nullable: true })
  TD_PURRED: string;

  @Column({ nullable: true })
  TD_TRNO: string;

  @Column({ nullable: true })
  SMCODE: string;

  @Column({ nullable: true })
  CHQNO: string;

  @Column({ nullable: true })
  INVNAME: string;

  @Column({ nullable: true })
  TRNMODE: string;

  @Column({ nullable: true })
  TRNSTAT: string;

  @Column({ nullable: true })
  TD_BRANCH: string;

  @Column({ nullable: true })
  ISCTRNO: string;

  @Column({ type: 'date', nullable: true })
  TD_TRDT: Date;

  @Column({ type: 'date', nullable: true })
  TD_PRDT: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  TD_POP: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  TD_UNITS: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  TD_AMT: number;

  @Column({ nullable: true })
  TD_AGENT: string;

  @Column({ nullable: true })
  TD_BROKER: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  BROKPER: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  BROKCOMM: number;

  @Column({ nullable: true })
  INVID: string;

  @Column({ type: 'date', nullable: true })
  CRDATE: Date;

  @Column({ nullable: true })
  CRTIME: string;

  @Column({ nullable: true })
  TRNSUB: string;

  @Column({ nullable: true })
  TD_APPNO: string;

  @Column({ nullable: true })
  UNQNO: string;

  @Column({ nullable: true })
  TRDESC: string;

  @Column({ nullable: true })
  TD_TRTYPE: string;

  @Column({ type: 'date', nullable: true })
  CHQDATE: Date;

  @Column({ nullable: true })
  CHQBANK: string;

  @Column({ nullable: true })
  DIVOPT: string;

  @Column({ nullable: true })
  TRFLAG: string;

  @Column({ type: 'decimal', precision: 15, scale: 4, nullable: true })
  TD_NAV: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  STT: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  LOAD1: number;

  @Column({ nullable: true })
  IHNO: string;

  @Column({ nullable: true })
  BRANCHCODE: string;

  @Column({ nullable: true })
  INWARDNUM0: string;

  @Column({ nullable: true })
  PAN1: string;

  @Column({ nullable: true })
  NCTREMARKS: string;

  @Column({ type: 'date', nullable: true })
  NAVDATE: Date;

  @Column({ nullable: true })
  PAN2: string;

  @Column({ nullable: true })
  PAN3: string;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  TDSAMOUNT: number;

  @Column({ nullable: true })
  SCH1: string;

  @Column({ nullable: true })
  PLN1: string;

  @Column({ nullable: true })
  PRCODE1: string;

  @Column({ nullable: true })
  TD_TRXNMO1: string;

  @Column({ nullable: true })
  CLIENTID: string;

  @Column({ nullable: true })
  DPID: string;

  @Column({ nullable: true })
  STATUS: string;

  @Column({ nullable: true })
  REJTRNOOR2: string;

  @Column({ nullable: true })
  SUBTRTYPE: string;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  TRCHARGES: number;

  @Column({ nullable: true })
  ATMCARDST3: string;

  @Column({ nullable: true })
  ATMCARDRE4: string;

  @Column({ type: 'date', nullable: true })
  BROK_ENTDT: Date;

  @Column({ nullable: true })
  SCHEMEISIN: string;

  @Column({ nullable: true })
  CITYCATEG5: string;

  @Column({ type: 'date', nullable: true })
  PORTDT: Date;

  @Column({ nullable: true })
  NEWUNQNO: string;

  @Column({ nullable: true })
  EUIN: string;

  @Column({ nullable: true })
  SUBARNCODE: string;

  @Column({ nullable: true })
  EVALID: string;

  @Column({ type: 'tinyint', width: 1, nullable: true })
  EDECLFLAG: boolean;

  @Column({ nullable: true })
  ASSETTYPE: string;

  @Column({ nullable: true })
  SIPREGDT: string;

  @Column({ nullable: true })
  TD_SCHEME: string;

  @Column({ nullable: true })
  TD_PLAN: string;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  INSAMOUNT: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  BROK_VALU6: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  DIVPER: number;

  @Column({ nullable: true })
  CAN: string;

  @Column({ nullable: true })
  EXCHORGTR7: string;

  @Column({ nullable: true })
  ELECTRXNF8: string;

  @Column({ nullable: true })
  SIPREGSLNO: string;

  @Column({ type: 'tinyint', width: 1, nullable: true })
  CLEARED: boolean;

  @Column({ nullable: true })
  INVSTATE: string;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  STAMPDUTY: number;

  @Column({ nullable: true })
  FEEDTYPE: string;
}
