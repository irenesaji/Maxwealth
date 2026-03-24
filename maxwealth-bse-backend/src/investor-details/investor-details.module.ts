import { Module } from '@nestjs/common';
import { InvestorDetailsService } from './investor-details.service';
import { InvestorDetailsController } from './investor-details.controller';
import { InvestorDetail } from './entities/investor-detail.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionReports } from './entities/transaction-details.entity';
import { Source } from './entities/sources.entity';
import { TransactionsModule } from 'src/transactions/transactions.module';
import { IsinlookupModule } from 'src/isinlookup/isinlookup.module';
import { UserOnboardingDetails } from 'src/onboarding/entities/user_onboarding_details.entity';
import { Users } from 'src/users/entities/users.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      InvestorDetail,
      TransactionReports,
      Source,
      Users,
      UserOnboardingDetails,
    ]),
    TransactionsModule,
    IsinlookupModule,
  ],
  controllers: [InvestorDetailsController],
  providers: [InvestorDetailsService],
  exports: [InvestorDetailsService],
})
export class InvestorDetailsModule {}
