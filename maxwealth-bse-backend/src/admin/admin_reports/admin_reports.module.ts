import { Module } from '@nestjs/common';
import { AdminReportsService } from './admin_reports.service';
import { AdminReportsController } from './admin_reports.controller';
import { FintechModule } from 'src/utils/fintech/fintech.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionBasketItems } from 'src/transaction_baskets/entities/transaction_basket_items.entity';
import { TransactionBasketItemsRepository } from 'src/repositories/transaction_basket_item.repository';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { PurchaseRepository } from 'src/repositories/purchase.repository';
import { TransactionReportsRepository } from 'src/repositories/transaction_reports.repository';
import { MutualfundsModule } from 'src/utils/mutualfunds/mutualfunds.module';
import { SourceRepository } from 'src/repositories/source.repository';
import { FundDetailsRepository } from 'src/repositories/fund_details.repository';
import { CostInflationIndexRepository } from 'src/repositories/cost_inflation.repository';
import { UsersRepository } from 'src/repositories/user.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([TransactionBasketItems]),
    FintechModule,
    MutualfundsModule,
  ],
  providers: [
    AdminReportsService,
    UsersRepository,
    TransactionBasketItemsRepository,
    PurchaseRepository,
    TransactionReportsRepository,
    SourceRepository,
    FundDetailsRepository,
    CostInflationIndexRepository,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  controllers: [AdminReportsController],
})
export class AdminReportsModule {}
