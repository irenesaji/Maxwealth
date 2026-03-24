import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
} from 'typeorm';

@Entity('fund_details')
export class FundDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  uniqueNo: string;

  @Column()
  schemeCode: string;

  @Column()
  rtaSchemeCode: string;

  @Column()
  amcSchemeCode: string;

  @Column()
  isin: string;

  @Column()
  amcCode: string;

  @Column()
  schemeType: string;

  @Column()
  schemePlan: string;

  @Column()
  schemeName: string;

  @Column({ default: false })
  purchaseAllowed: boolean;

  @Column()
  purchaseTransactionMode: string;

  @Column('decimal')
  minimumPurchaseAmount: number;

  @Column('decimal')
  additionalPurchaseAmount: number;

  @Column('decimal', { nullable: true })
  maximumPurchaseAmount: number;

  @Column('decimal')
  purchaseAmountMultiplier: number;

  @Column()
  purchaseCutoffTime: string;

  @Column({ default: false })
  redemptionAllowed: boolean;

  @Column()
  redemptionTransactionMode: string;

  @Column('decimal')
  minimumRedemptionQty: number;

  @Column('decimal')
  redemptionQtyMultiplier: number;

  @Column('decimal', { nullable: true })
  maximumRedemptionQty: number;

  @Column('decimal')
  redemptionAmountMinimum: number;

  @Column('decimal', { nullable: true })
  redemptionAmountMaximum: number;

  @Column('decimal')
  redemptionAmountMultiple: number;

  @Column()
  redemptionCutoffTime: string;

  @Column()
  rtaAgentCode: string;

  @Column({ default: true })
  amcActiveFlag: boolean;

  @Column({ default: false })
  dividendReinvestmentFlag: boolean;

  @Column({ default: false })
  sipFlag: boolean;

  @Column({ default: false })
  stpFlag: boolean;

  @Column({ default: false })
  swpFlag: boolean;

  @Column({ default: false })
  switchFlag: boolean;

  @Column()
  settlementType: string;

  @Column()
  amcInd: string;

  @Column('decimal')
  faceValue: number;

  @Column('date')
  startDate: Date;

  @Column('date', { nullable: true })
  endDate: Date;

  @Column({ default: false })
  exitLoadFlag: boolean;

  @Column({ type: 'text', nullable: true })
  exitLoad: string;

  @Column({ default: false })
  lockInPeriodFlag: boolean;

  @Column({ nullable: true })
  lockInPeriod: string;

  @Column({ nullable: true })
  channelPartnerCode: string;

  @Column('date', { nullable: true })
  reopeningDate: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
