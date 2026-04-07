import { Module } from '@nestjs/common';
import { TransactionBasketsService } from './transaction_baskets.service';
import { TransactionBasketsController } from './transaction_baskets.controller';
import { FintechModule } from 'src/utils/fintech/fintech.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionBaskets } from './entities/transaction_baskets.entity';
import { TransactionBasketItems } from './entities/transaction_basket_items.entity';
import { Purchase } from './entities/purchases.entity';
import { UserOnboardingDetails } from 'src/onboarding/entities/user_onboarding_details.entity';
import { Users } from 'src/users/entities/users.entity';
import { UserBankDetails } from 'src/onboarding/bank/entities/user_bank_details.entity';
import { Redemption } from './entities/redemptions.entity';
import { SwitchFunds } from './entities/switch_funds.entity';
import { MutualfundsModule } from 'src/utils/mutualfunds/mutualfunds.module';
import { SmartSipFunds } from 'src/smartsip_config/entities/smart_sip_funds.entity';
import { TransactionBasketsRepository } from 'src/repositories/transaction_baskets.repository';
import { TransactionBasketItemsRepository } from 'src/repositories/transaction_basket_item.repository';
import { PurchaseRepository } from 'src/repositories/purchase.repository';
import { UserOnboardingDetailsRepository } from 'src/repositories/user_onboarding_details.repository';
import { UsersRepository } from 'src/repositories/user.repository';
import { UserBankDetailsRepository } from 'src/repositories/user_bank_details.repository';
import { RedemptionRepository } from 'src/repositories/redemption.repository';
import { SwitchFundsRepository } from 'src/repositories/switch_fund.repository';
import { SmartSipFundsRepository } from 'src/repositories/smart_sip_funds.repository';
import { EnablexService } from 'src/utils/enablex/enablex.service';
import { HttpModule, HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { SmsConfigurationRepository } from 'src/repositories/sms_configuration.repository';
import { EnablexModule } from 'src/utils/enablex/enablex.module';
import { GoalRepository } from 'src/repositories/goal.repository';
import { RiskProfileRepository } from 'src/repositories/risk_profile.repository';
import { RazorpayModule } from 'src/utils/razorpay/razorpay.module';
import { SignzyModule } from 'src/utils/signzy/signzy.module';
import { RzpOrdersRepository } from 'src/repositories/rzp_orders.repository';
import { MfSwitchPlanRepository } from 'src/repositories/mf_switch_plan.repository';
import { MfRedemptionPlanRepository } from 'src/repositories/mf_redemption_plan.repository';
import { MfPurchasePlanRepository } from 'src/repositories/mf_purchase_plan.repository';
import { BseFrequency } from 'src/utils/bse/entities/bse_frequency.entity';
import { AmcRepository } from 'src/repositories/amc.repository';
import { BseFrequencyRepository } from 'src/repositories/bse_frequency.repository';
import { BseService } from 'src/utils/bse/bse.service';
import { MandatesRepository } from 'src/repositories/mandates.repository';
import { FundDetailsRepository } from 'src/repositories/fund_details.repository';
import { Bsev1Service } from 'src/utils/bsev1/bsev1.service';
import { BseXSipRegisterRepository } from 'src/repositories/bse_xsip_register.repository';
import { BseSwpRegisterRepository } from 'src/repositories/bse_swp_register.repository';
import { BseStpRegisterRepository } from 'src/repositories/bse_stp_register.repository';
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
    FintechModule,
    SignzyModule,
    RazorpayModule,
    MutualfundsModule,
    EnablexModule,
    HttpModule,
    CamsEncryptDecryptModule,
  ],
  providers: [
    TransactionBasketsService,
    MfSwitchPlanRepository,
    MfRedemptionPlanRepository,
    MfPurchasePlanRepository,
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
    Bsev1EmandateBankCodeRepository,
    Bsev1UpiBankCodeRepository,
    AmcRepository,
    MandatesRepository,
    FundDetailsRepository,
    BseXSipRegisterRepository,
    BseSwpRegisterRepository,
    BseStpRegisterRepository,
    BseXSipOrderRepository,
    BseSwitchOrderRepository,
    BsePurchaseRedemOrderRepository,
    UniqueReferenceNoRepository,
    BseService,
    Bsev1Service,
    CamsService,
    CamsEncryptDecryptService,
    KarvyService,
    ModelPortfolioRepository,
  ],
  controllers: [TransactionBasketsController],
  exports: [TransactionBasketsService],
})
export class TransactionBasketsModule {}
