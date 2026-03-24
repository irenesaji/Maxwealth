import { Module } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { PortfolioController } from './portfolio.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserOnboardingDetails } from 'src/onboarding/entities/user_onboarding_details.entity';
import { FintechModule } from 'src/utils/fintech/fintech.module';
import { MutualfundsModule } from 'src/utils/mutualfunds/mutualfunds.module';
import { UserReturnsHistory } from './entities/user_returns_history.entity';
import { CapitalGainReport } from './entities/capital_gain_reports.entity';
import { TransactionBasketItems } from 'src/transaction_baskets/entities/transaction_basket_items.entity';
import { TransactionBaskets } from 'src/transaction_baskets/entities/transaction_baskets.entity';
import { UserSmartReturnsHistory } from './entities/user_smart_returns_history.entity';
import { UserOnboardingDetailsRepository } from 'src/repositories/user_onboarding_details.repository';
import { UserReturnsHistoryRepository } from 'src/repositories/user_returns_history.repository';
import { UserSmartReturnsHistoryRepository } from 'src/repositories/user_smart_returns_history.repository';
import { CapitalGainReportRepository } from 'src/repositories/capital_gain_report.repository';
import { TransactionBasketsRepository } from 'src/repositories/transaction_baskets.repository';
import { TransactionBasketItemsRepository } from 'src/repositories/transaction_basket_item.repository';
import { ModelPortfolio } from 'src/model_portfolio/entities/model_portfolios.entity';
import { ModelPortfolioFundRepository } from 'src/repositories/model_portfolio_fund.repository';
import { Users } from 'src/users/entities/users.entity';
import { UsersRepository } from 'src/repositories/user.repository';
import { TransactionReports } from 'src/investor-details/entities/transaction-details.entity';
import { TransactionsModule } from 'src/transactions/transactions.module';
import { UserReturnsHistoryVersion2Repository } from 'src/repositories/user_return_v2.repository';
import { DistributorLogoRepository } from 'src/repositories/distributor_logo.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserOnboardingDetails,
      UserReturnsHistory,
      UserSmartReturnsHistory,
      CapitalGainReport,
      TransactionBaskets,
      TransactionReports,
      TransactionBasketItems,
      ModelPortfolio,
      Users,
    ]),
    FintechModule,
    MutualfundsModule,
    TransactionsModule,
  ],
  providers: [
    PortfolioService,
    UsersRepository,
    UserOnboardingDetailsRepository,
    UserReturnsHistoryRepository,
    UserReturnsHistoryVersion2Repository,
    UserSmartReturnsHistoryRepository,
    CapitalGainReportRepository,
    TransactionBasketsRepository,
    TransactionBasketItemsRepository,
    ModelPortfolioFundRepository,
    DistributorLogoRepository,
  ],
  controllers: [PortfolioController],
})
export class PortfolioModule {}
