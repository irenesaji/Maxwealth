import { Module } from '@nestjs/common';
import { MandatesService } from './mandates.service';
import { MandatesController } from './mandates.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mandates } from './entities/mandates.entity';
import { Users } from 'src/users/entities/users.entity';
import { FintechModule } from 'src/utils/fintech/fintech.module';
import { UserBankDetails } from 'src/onboarding/bank/entities/user_bank_details.entity';
import { UsersRepository } from 'src/repositories/user.repository';
import { UserBankDetailsRepository } from 'src/repositories/user_bank_details.repository';
import { MandatesRepository } from 'src/repositories/mandates.repository';
import { RazorpayModule } from 'src/utils/razorpay/razorpay.module';
import { BseService } from 'src/utils/bse/bse.service';
import { BseMandatesRepository } from 'src/repositories/bse_mandates.repository';
import { HttpModule } from '@nestjs/axios';
import { BseMandateTypeRepository } from 'src/repositories/bse.repository';
import { UserOnboardingDetailsRepository } from 'src/repositories/user_onboarding_details.repository';
import { Bsev1Service } from 'src/utils/bsev1/bsev1.service';
import { TransactionBasketsService } from 'src/transaction_baskets/transaction_baskets.service';
import { TransactionBasketsRepository } from 'src/repositories/transaction_baskets.repository';
import { AmcRepository } from 'src/repositories/amc.repository';
import { BseFrequencyRepository } from 'src/repositories/bse_frequency.repository';
import { BseStpRegisterRepository } from 'src/repositories/bse_stp_register.repository';
import { BseSwpRegisterRepository } from 'src/repositories/bse_swp_register.repository';
import { BseXSipRegisterRepository } from 'src/repositories/bse_xsip_register.repository';
import { FundDetailsRepository } from 'src/repositories/fund_details.repository';
import { GoalRepository } from 'src/repositories/goal.repository';
import { PurchaseRepository } from 'src/repositories/purchase.repository';
import { RedemptionRepository } from 'src/repositories/redemption.repository';
import { RiskProfileRepository } from 'src/repositories/risk_profile.repository';
import { RzpOrdersRepository } from 'src/repositories/rzp_orders.repository';
import { SmartSipFundsRepository } from 'src/repositories/smart_sip_funds.repository';
import { SwitchFundsRepository } from 'src/repositories/switch_fund.repository';
import { TransactionBasketItemsRepository } from 'src/repositories/transaction_basket_item.repository';
import { MfSwitchPlanRepository } from 'src/repositories/mf_switch_plan.repository';
import { MfRedemptionPlanRepository } from 'src/repositories/mf_redemption_plan.repository';
import { MfPurchasePlanRepository } from 'src/repositories/mf_purchase_plan.repository';
import { SignzyModule } from 'src/utils/signzy/signzy.module';
import { MutualfundsModule } from 'src/utils/mutualfunds/mutualfunds.module';
import { EnablexModule } from 'src/utils/enablex/enablex.module';
import { CamsService } from 'src/utils/cams/cams.service';
import { KarvyService } from 'src/utils/karvy/karvy.service';
import { Bsev1EmandateBankCodeRepository } from 'src/repositories/bsev1_emandate_bank_code.repository';
import { Bsev1UpiBankCodeRepository } from 'src/repositories/bsev1_upi_bank_code.repository';
import { CamsEncryptDecryptModule } from 'src/utils/cams_encrypt_decrypt/cams_encrypt_decrypt.module';
import { CamsEncryptDecryptService } from 'src/utils/cams_encrypt_decrypt/cams_encrypt_decrypt.service';
import { BseXSipOrderRepository } from 'src/repositories/bsev1_xsip_order.repository';
import { BseSwitchOrderRepository } from 'src/repositories/bsev1_switch_order.repository';
import { BsePurchaseRedemOrderRepository } from 'src/repositories/bsev1_purchase_order.repository';
import { UniqueReferenceNoRepository } from 'src/repositories/unique_reference_no.repository';
import { ModelPortfolioRepository } from 'src/repositories/model_portfolio.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Mandates, Users, UserBankDetails]),
    FintechModule,
    RazorpayModule,
    HttpModule,
    SignzyModule,
    MutualfundsModule,
    EnablexModule,
    CamsEncryptDecryptModule,
  ],
  providers: [
    MandatesService,
    MandatesRepository,
    UsersRepository,
    UserBankDetailsRepository,
    BseMandatesRepository,
    BseMandateTypeRepository,
    UserOnboardingDetailsRepository,
    ModelPortfolioRepository,
    BseService,
    Bsev1Service,
    TransactionBasketsService,
    TransactionBasketsRepository,
    TransactionBasketItemsRepository,
    PurchaseRepository,
    UserOnboardingDetailsRepository,
    UsersRepository,
    UserBankDetailsRepository,
    RedemptionRepository,
    SwitchFundsRepository,
    SmartSipFundsRepository,
    GoalRepository,
    RiskProfileRepository,
    RzpOrdersRepository,
    BseFrequencyRepository,
    AmcRepository,
    MandatesRepository,
    FundDetailsRepository,
    BseXSipRegisterRepository,
    BseSwpRegisterRepository,
    BseStpRegisterRepository,
    MfSwitchPlanRepository,
    MfRedemptionPlanRepository,
    Bsev1EmandateBankCodeRepository,
    Bsev1UpiBankCodeRepository,
    MfPurchasePlanRepository,
    BseXSipOrderRepository,
    BseSwitchOrderRepository,
    BsePurchaseRedemOrderRepository,
    UniqueReferenceNoRepository,
    CamsService,
    CamsEncryptDecryptService,
    KarvyService,
  ],
  controllers: [MandatesController],
})
export class MandatesModule {}
