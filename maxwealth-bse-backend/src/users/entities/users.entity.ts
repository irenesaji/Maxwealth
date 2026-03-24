import { Mandates } from 'src/mandates/entities/mandates.entity';
import { UserOnboardingDetails } from 'src/onboarding/entities/user_onboarding_details.entity';
import { RiskUserQuiz } from 'src/risk_profiles/entities/risk_user_quizes.entity';
import { TransactionBaskets } from 'src/transaction_baskets/entities/transaction_baskets.entity';
import { TransactionBasketItems } from 'src/transaction_baskets/entities/transaction_basket_items.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
  OneToOne,
  ManyToMany,
  ManyToOne,
  Unique,
} from 'typeorm';
import Role from './role.enum';
import { RiskProfile } from 'src/risk_profiles/entities/risk_profiles.entity';
import { SkipInstruction } from 'src/transaction_baskets/entities/sip_skip_instructions.entity';
import { Purchase } from 'src/transaction_baskets/entities/purchases.entity';
import { TaxResidency } from 'src/onboarding/entities/tax_residency.entity';
import { DematAccount } from 'src/onboarding/entities/demat_account.entity';
import { SignzyKycObject } from 'src/onboarding/entities/signzy_kyc_object.entity';
import { KycStatusDetail } from 'src/onboarding/entities/kyc_status_details.entity';
import { RzpOrder } from 'src/utils/razorpay/entities/rzp_orders.entity';
import { MfRedemptionPlan } from 'src/transaction_baskets/entities/mf_redemption_plan.entity';
import { MfPurchasePlan } from 'src/transaction_baskets/entities/mf_purchase_plan.entity';
import { MfSwitchPlan } from 'src/transaction_baskets/entities/mf_switch_plan.entity';
import { CamsInvestorMasterFolios } from 'src/cams_investor_master_folios/entities/cams_investor_master_folio.entity';
import { KfintechInvestorMasterFolios } from 'src/kfintech_investor_master_folios/entities/kfintech_investor_master_folio.entity';
import { KfintechTransactionMasterFolios } from 'src/kfintech_transaction_master_folios/entities/kfintech_transaction_master_folio.entity';
import { SwitchFunds } from 'src/transaction_baskets/entities/switch_funds.entity';
import { Redemption } from 'src/transaction_baskets/entities/redemptions.entity';

@Entity('users')
@Unique(['email'])
@Unique(['mobile'])
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  full_name: string;

  @Column()
  email: string;

  @Column({ nullable: true, default: null })
  mpin: string;

  @Column()
  mobile: string;

  @Column({ default: false })
  mobile_verified: boolean;

  @Column({ default: true })
  is_active: boolean;

  @Column({ default: false })
  is_blocked: boolean;

  @Column({ nullable: true, default: null })
  otp: number;

  @Column({ nullable: true, default: null })
  country_code: string;

  @Column({ nullable: true, default: null })
  risk_profile_id: number;

  @Column({ default: true })
  is_daily_portfolio_updates: boolean;

  @Column({ default: true })
  is_whatsapp_notifications: boolean;

  @Column({ default: true })
  is_enable_biometrics: boolean;

  @Column({ default: false })
  is_lead: boolean;

  @Column()
  user_code: string;

  @Column()
  referral_code: string;

  @Column()
  fcmToken: string;

  @Column()
  email_otp: number;

  @Column({ default: false })
  is_email_verified: boolean;

  @Column()
  expiry_time: Date;

  @Column({
    type: 'enum',
    enum: Role,
    array: false,
    default: Role.User,
  })
  public role: Role;

  // @OneToMany(type => TransactionBaskets , transaction_baskets => transaction_baskets.user)
  // @JoinColumn({name: 'user_id'})
  // transaction_baskets: TransactionBaskets[];

  @ManyToOne((type) => RiskProfile, (risk_profile) => risk_profile.users)
  @JoinColumn({ name: 'risk_profile_id' })
  risk_profile: RiskProfile | null;

  // @JoinColumn({ name: 'user_id' })
  @OneToOne(
    (type) => UserOnboardingDetails,
    (user_onboarding_details) => user_onboarding_details.user,
  )
  user_onboarding_details: UserOnboardingDetails;

  @OneToMany(
    (type) => TransactionBasketItems,
    (transaction_basket_items) => transaction_basket_items.user,
  )
  transaction_basket_items: TransactionBasketItems;

  @OneToMany((type) => Purchase, (purchases) => purchases.user)
  purchases: Purchase;

  @OneToMany(
    (type) => RiskUserQuiz,
    (risk_user_quizes) => risk_user_quizes.user,
  )
  risk_user_quizes: RiskUserQuiz;

  @OneToMany((type) => Mandates, (mandates) => mandates.user)
  mandates: Mandates;

  @OneToMany(() => SkipInstruction, (skipInstruction) => skipInstruction.user)
  skipInstructions: SkipInstruction[];

  @OneToMany(() => RzpOrder, (rzp_order) => rzp_order.user)
  rzp_orders: RzpOrder[];

  @OneToMany(() => TaxResidency, (tax_residencies) => tax_residencies.user)
  tax_residencies: TaxResidency[];

  @OneToMany(() => DematAccount, (demat_accounts) => demat_accounts.user)
  demat_accounts: DematAccount[];

  @OneToMany(
    () => SignzyKycObject,
    (signzy_kyc_objects) => signzy_kyc_objects.user,
  )
  signzy_kyc_objects: SignzyKycObject[];

  // @OneToOne(type => UserOnboardingDetails , user_onboarding_details => user_onboarding_details.user)
  // @JoinColumn({name: 'id'})
  // user_onboarding_details: UserOnboardingDetails;

  @OneToMany(() => KycStatusDetail, (kycStatusDetails) => kycStatusDetails.user)
  kyc_status_details: KycStatusDetail[];

  @OneToMany(() => SwitchFunds, (switch_funds) => switch_funds.user)
  switch_funds: SwitchFunds[];

  @OneToMany(() => Redemption, (redemptions) => redemptions.user)
  redemptions: Redemption[];

  @OneToMany(() => MfSwitchPlan, (mf_switch_plans) => mf_switch_plans.user)
  mf_switch_plans: MfSwitchPlan[];

  @OneToMany(
    () => MfPurchasePlan,
    (mf_purchase_plans) => mf_purchase_plans.user,
  )
  mf_purchase_plans: MfPurchasePlan[];

  @OneToMany(
    () => MfRedemptionPlan,
    (mf_redemption_plans) => mf_redemption_plans.user,
  )
  mf_redemption_plans: MfRedemptionPlan[];

  @OneToMany(() => KfintechInvestorMasterFolios, (kfintech) => kfintech.user)
  kfintechInvestorMasterFolios: KfintechInvestorMasterFolios[];

  @OneToMany(() => CamsInvestorMasterFolios, (cams) => cams.user)
  camsInvestorMasterFolios: CamsInvestorMasterFolios[];

  @Column()
  created_at: Date;

  @Column()
  updated_at: Date;
}
