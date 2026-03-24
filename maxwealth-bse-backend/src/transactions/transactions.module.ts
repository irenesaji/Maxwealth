import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CamsTransactionDetails } from 'src/cams_investor_master_folios/entities/cams_transaction.entity';
import { Source } from 'src/investor-details/entities/sources.entity';
import { TransactionReports } from 'src/investor-details/entities/transaction-details.entity';
import { MutualfundsModule } from 'src/utils/mutualfunds/mutualfunds.module';
import { CostInflationIndex } from './entities/cii.entity';
import { FundDetail } from 'src/fund_details/entities/fund_detail.entity';
import { FundDetailsRepository } from 'src/repositories/fund_details.repository';
import { Users } from 'src/users/entities/users.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CamsTransactionDetails,
      TransactionReports,
      Users,
      Source,
      CostInflationIndex,
      FundDetail,
    ]),
    MutualfundsModule,
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService, FundDetailsRepository],
  exports: [TransactionsService],
})
export class TransactionsModule {}
