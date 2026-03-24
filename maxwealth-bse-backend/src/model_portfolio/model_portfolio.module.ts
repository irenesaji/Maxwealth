import { Module } from '@nestjs/common';
import { ModelPortfolioService } from './model_portfolio.service';
import { ModelPortfolioController } from './model_portfolio.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModelPortfolio } from './entities/model_portfolios.entity';
import { ModelPortfolioFund } from './entities/model_portfolio_funds.entity';
import { FintechModule } from 'src/utils/fintech/fintech.module';
import { MutualfundsModule } from 'src/utils/mutualfunds/mutualfunds.module';
import { ModelPortfolioAssociatedFund } from './entities/model_portfolio_associated_fund.entity';
import { ModelPortfolioRepository } from 'src/repositories/model_portfolio.repository';
import { ModelPortfolioFundRepository } from 'src/repositories/model_portfolio_fund.repository';
import { ModelPortfolioAssociatedFundRepository } from 'src/repositories/model_portfolio_associated_fund.repository';
import { TransactionBasketsModule } from 'src/transaction_baskets/transaction_baskets.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ModelPortfolio,
      ModelPortfolioFund,
      ModelPortfolioAssociatedFund,
    ]),
    FintechModule,
    MutualfundsModule,
    TransactionBasketsModule,
  ],
  providers: [
    ModelPortfolioService,
    ModelPortfolioRepository,
    ModelPortfolioFundRepository,
    ModelPortfolioAssociatedFundRepository,
  ],
  controllers: [ModelPortfolioController],
})
export class ModelPortfolioModule {}
