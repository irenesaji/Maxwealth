import { Module } from '@nestjs/common';
import { OnboardingService } from './onboarding.service';
import { OnboardingController } from './onboarding.controller';
import { FintechModule } from '../utils/fintech/fintech.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserOnboardingDetails } from './entities/user_onboarding_details.entity';
import { UsersModule } from 'src/users/users.module';
import { UserAddressDetails } from './address/entities/user_address_details.entity';
import { UserNomineeDetails } from './nominee/entities/user-nominee-details.entity';
import { UserBankDetails } from './bank/entities/user_bank_details.entity';
import { TransactionBasketItems } from 'src/transaction_baskets/entities/transaction_basket_items.entity';
import { Purchase } from 'src/transaction_baskets/entities/purchases.entity';
import { PichainModule } from 'src/utils/pichain/pichain.module';
import { UserOnboardingDetailsRepository } from 'src/repositories/user_onboarding_details.repository';
import { TransactionBasketItemsRepository } from 'src/repositories/transaction_basket_item.repository';
import { UserAddressDetailsRepository } from 'src/repositories/user_address_details.repository';
import { UserNomineeDetailsRepository } from 'src/repositories/user_nominee_details.repository';
import { UserBankDetailsRepository } from 'src/repositories/user_bank_details.repository';
import { PurchaseRepository } from 'src/repositories/purchase.repository';
import { EmailAddress } from './entities/email_addresses.entity';
import { PhoneNumber } from './entities/phone_numbers.entity';
import { EmailAddressRepository } from 'src/repositories/email_address.repository';
import { PhoneNumberRepository } from 'src/repositories/phone_number.repository';
import { SignzyModule } from 'src/utils/signzy/signzy.module';
import { SignzyKycObjectRepository } from 'src/repositories/signzy_kyc_object.repository';
import { KycStatusDetail } from './entities/kyc_status_details.entity';
import { KycStatusDetailRepository } from 'src/repositories/kyc_status_details.repository';
import { MastersModule } from './masters/masters.module';
import { BseModule } from 'src/utils/bse/bse.module';
import {
  BseBankAccTypeRepository,
  BseGenderRepository,
  BseIncomeSlabRepository,
  BseNominationRelationRepository,
  BseOccCodeRepository,
  BseOccTypeRepository,
  BsePanExemptCategoryRepository,
  BseWealthSourceRepository,
} from 'src/repositories/bse.repository';
import {
  BseIncomeSlab,
  BseOccType,
  BseWealthSource,
} from 'src/utils/bse/entity/bse.entity';
import { Bsev1Service } from 'src/utils/bsev1/bsev1.service';
import { HttpModule } from '@nestjs/axios';
import { TransactionBasketsModule } from 'src/transaction_baskets/transaction_baskets.module';
import { TransactionBasketsService } from 'src/transaction_baskets/transaction_baskets.service';
import { TransactionBasketsRepository } from 'src/repositories/transaction_baskets.repository';
import { RedemptionRepository } from 'src/repositories/redemption.repository';
import { SwitchFundsRepository } from 'src/repositories/switch_fund.repository';
import { SmartSipFundsRepository } from 'src/repositories/smart_sip_funds.repository';
import { RiskProfileRepository } from 'src/repositories/risk_profile.repository';
import { GoalRepository } from 'src/repositories/goal.repository';
import { RzpOrdersRepository } from 'src/repositories/rzp_orders.repository';
import { MfSwitchPlanRepository } from 'src/repositories/mf_switch_plan.repository';
import { MfRedemptionPlanRepository } from 'src/repositories/mf_redemption_plan.repository';
import { MfPurchasePlanRepository } from 'src/repositories/mf_purchase_plan.repository';
import { AmcRepository } from 'src/repositories/amc.repository';
import { BseFrequencyRepository } from 'src/repositories/bse_frequency.repository';
import { MandatesRepository } from 'src/repositories/mandates.repository';
import { FundDetailsRepository } from 'src/repositories/fund_details.repository';
import { BseXSipRegisterRepository } from 'src/repositories/bse_xsip_register.repository';
import { BseSwpRegisterRepository } from 'src/repositories/bse_swp_register.repository';
import { BseStpRegisterRepository } from 'src/repositories/bse_stp_register.repository';
import { BseService } from 'src/utils/bse/bse.service';
import { RazorpayService } from 'src/utils/razorpay/razorpay.service';
import { MutualfundsModule } from 'src/utils/mutualfunds/mutualfunds.module';
import { EnablexModule } from 'src/utils/enablex/enablex.module';
import { CamsService } from 'src/utils/cams/cams.service';
import { KarvyService } from 'src/utils/karvy/karvy.service';
import { RazorpayPennyDropRepository } from 'src/repositories/razorpay_penny_drop.repository';
import { RzpTransfersRepository } from 'src/repositories/rzp_transfers.repository';
import { RzpCustomerRepository } from 'src/repositories/rzp_customer.repository';
import { BseStateandCodeRepository } from 'src/repositories/bse_state_and_codes.repository';
import { Bsev1NomineeRelationshipCodeRepository } from 'src/repositories/bse_v1_nominee_relationship_code.repository';
import { Bsev1EmandateBankCodeRepository } from 'src/repositories/bsev1_emandate_bank_code.repository';
import { Bsev1UpiBankCodeRepository } from 'src/repositories/bsev1_upi_bank_code.repository';
import { CamsEncryptDecryptModule } from 'src/utils/cams_encrypt_decrypt/cams_encrypt_decrypt.module';
import { CamsEncryptDecryptService } from 'src/utils/cams_encrypt_decrypt/cams_encrypt_decrypt.service';
import { BseXSipOrderRepository } from 'src/repositories/bsev1_xsip_order.repository';
import { BseSwitchOrderRepository } from 'src/repositories/bsev1_switch_order.repository';
import { BsePurchaseRedemOrderRepository } from 'src/repositories/bsev1_purchase_order.repository';
import { UniqueReferenceNoRepository } from 'src/repositories/unique_reference_no.repository';
import { BankModule } from './bank/bank.module';
import { ModelPortfolioRepository } from 'src/repositories/model_portfolio.repository';

@Module({
  imports: [
    SignzyModule,
    TypeOrmModule.forFeature([
      EmailAddress,
      PhoneNumber,
      UserOnboardingDetails,
      TransactionBasketItems,
      UserAddressDetails,
      UserNomineeDetails,
      UserBankDetails,
      Purchase,
    ]),
    FintechModule,
    HttpModule,
    EnablexModule,
    PichainModule,
    MutualfundsModule,
    UsersModule,
    TransactionBasketsModule,
    CamsEncryptDecryptModule,
    MastersModule,
    BseModule,
    BankModule,
  ],
  providers: [
    KycStatusDetailRepository,
    SignzyKycObjectRepository,
    ModelPortfolioRepository,
    KycStatusDetail,
    OnboardingService,
    UserOnboardingDetailsRepository,
    TransactionBasketItemsRepository,
    UserAddressDetailsRepository,
    UserNomineeDetailsRepository,
    UserBankDetailsRepository,
    PurchaseRepository,
    PhoneNumberRepository,
    EmailAddressRepository,
    BseOccCodeRepository,
    BsePanExemptCategoryRepository,
    BseOccTypeRepository,
    BseGenderRepository,
    BseNominationRelationRepository,
    BseBankAccTypeRepository,
    BseWealthSourceRepository,
    BseIncomeSlabRepository,
    TransactionBasketsRepository,
    Bsev1Service,
    TransactionBasketsService,
    CamsEncryptDecryptService,
    RedemptionRepository,
    SwitchFundsRepository,
    SmartSipFundsRepository,
    RiskProfileRepository,
    GoalRepository,
    RzpOrdersRepository,
    MfSwitchPlanRepository,
    MfRedemptionPlanRepository,
    MfPurchasePlanRepository,
    AmcRepository,
    BseFrequencyRepository,
    MandatesRepository,
    FundDetailsRepository,
    BseXSipRegisterRepository,
    BseSwpRegisterRepository,
    BseStpRegisterRepository,
    BseService,
    RazorpayService,
    CamsService,
    KarvyService,
    RazorpayPennyDropRepository,
    RzpTransfersRepository,
    RzpCustomerRepository,
    BseStateandCodeRepository,
    Bsev1EmandateBankCodeRepository,
    Bsev1UpiBankCodeRepository,
    BseXSipOrderRepository,
    BseSwitchOrderRepository,
    BsePurchaseRedemOrderRepository,
    UniqueReferenceNoRepository,
    Bsev1NomineeRelationshipCodeRepository,
  ],
  controllers: [OnboardingController],
  exports: [OnboardingService],
})
export class OnboardingModule {}
