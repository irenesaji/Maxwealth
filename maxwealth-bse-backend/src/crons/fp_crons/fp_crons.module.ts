import { Module } from '@nestjs/common';
import { FpCronsService } from './fp_crons.service';
import { FpCronsController } from './fp_crons.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserOnboardingDetails } from 'src/onboarding/entities/user_onboarding_details.entity';
import { MutualfundsModule } from 'src/utils/mutualfunds/mutualfunds.module';
import { FintechModule } from 'src/utils/fintech/fintech.module';
import { UserReturnsHistory } from 'src/portfolio/entities/user_returns_history.entity';
import { Msg91Module } from 'src/utils/msg91/msg91.module';
import { SmartSipConfiguration } from 'src/smartsip_config/entities/smart_sip_configurations.entity';
import { SmartSipFunds } from 'src/smartsip_config/entities/smart_sip_funds.entity';
import { UserSmartReturnsHistory } from 'src/portfolio/entities/user_smart_returns_history.entity';
import { TransactionBasketItems } from 'src/transaction_baskets/entities/transaction_basket_items.entity';
import { Purchase } from 'src/transaction_baskets/entities/purchases.entity';
import { TransactionBaskets } from 'src/transaction_baskets/entities/transaction_baskets.entity';
import { UserOnboardingDetailsRepository } from 'src/repositories/user_onboarding_details.repository';
import { UserReturnsHistoryRepository } from 'src/repositories/user_returns_history.repository';
import { TransactionBasketsRepository } from 'src/repositories/transaction_baskets.repository';
import { TransactionBasketItemsRepository } from 'src/repositories/transaction_basket_item.repository';
import { PurchaseRepository } from 'src/repositories/purchase.repository';
import { UserSmartReturnsHistoryRepository } from 'src/repositories/user_smart_returns_history.repository';
import { SmartSipConfigurationRepository } from 'src/repositories/smart_sip_configuration.repository';
import { SmartSipFundsRepository } from 'src/repositories/smart_sip_funds.repository';
import { EnablexModule } from 'src/utils/enablex/enablex.module';
import { HttpModule } from '@nestjs/axios';
import { EmailModule } from 'src/email/email.module';
import { ExcelModule } from 'src/excel/excel.module';
import { DataModule } from 'src/data/data.module';
import { KfintechInvestorMasterFoliosService } from 'src/kfintech_investor_master_folios/kfintech_investor_master_folios.service';
import { Amc } from 'src/amcs/entities/amc.entity';
import { Users } from 'src/users/entities/users.entity';
import { UserAddressDetails } from 'src/onboarding/address/entities/user_address_details.entity';
import { UserBankDetails } from 'src/onboarding/bank/entities/user_bank_details.entity';
import { KycStatusDetail } from 'src/onboarding/entities/kyc_status_details.entity';
import { UserNomineeDetails } from 'src/onboarding/nominee/entities/user-nominee-details.entity';
import { KfintechInvestorMasterFoliosModule } from 'src/kfintech_investor_master_folios/kfintech_investor_master_folios.module';
import { TransactionsModule } from 'src/transactions/transactions.module';
import { TransactionsService } from 'src/transactions/transactions.service';
import { CamsTransactionDetails } from 'src/cams_investor_master_folios/entities/cams_transaction.entity';
import { TransactionReports } from 'src/investor-details/entities/transaction-details.entity';
import { FundDetail } from 'src/fund_details/entities/fund_detail.entity';
import { Source } from 'src/investor-details/entities/sources.entity';
import { CostInflationIndex } from 'src/transactions/entities/cii.entity';
import { CamsModule } from 'src/utils/cams/cams.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserOnboardingDetails,
      CamsTransactionDetails,
      TransactionBaskets,
      TransactionsModule,
      TransactionBasketItems,
      TransactionReports,
      Source,
      CostInflationIndex,
      FundDetail,
      Purchase,
      UserReturnsHistory,
      UserSmartReturnsHistory,
      SmartSipConfiguration,
      SmartSipFunds,
      Amc,
      Users,
      UserAddressDetails,
      UserBankDetails,
      UserNomineeDetails,
      KycStatusDetail,
    ]),
    MutualfundsModule,
    FintechModule,
    Msg91Module,
    MutualfundsModule,
    EnablexModule,
    HttpModule,
    EmailModule,
    ExcelModule,
    DataModule,
    KfintechInvestorMasterFoliosModule,
    CamsModule,
  ],
  providers: [
    FpCronsService,
    TransactionsService,
    UserOnboardingDetailsRepository,
    UserReturnsHistoryRepository,
    TransactionBasketsRepository,
    TransactionBasketItemsRepository,
    PurchaseRepository,
    UserSmartReturnsHistoryRepository,
    SmartSipConfigurationRepository,
    SmartSipFundsRepository,
  ],
  controllers: [FpCronsController],
})
export class FpCronsModule {}
