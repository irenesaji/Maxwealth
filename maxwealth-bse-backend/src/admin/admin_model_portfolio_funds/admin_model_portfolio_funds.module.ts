import { Module } from '@nestjs/common';
import { AdminModelPortfolioFundsService } from './admin_model_portfolio_funds.service';
import { AdminModelPortfolioFundsController } from './admin_model_portfolio_funds.controller';
import { ModelPortfolioFund } from 'src/model_portfolio/entities/model_portfolio_funds.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from 'src/auth/guard/roles.guard';

@Module({
  imports: [TypeOrmModule.forFeature([ModelPortfolioFund])],
  providers: [
    AdminModelPortfolioFundsService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  controllers: [AdminModelPortfolioFundsController],
})
export class AdminModelPortfolioFundsModule {}
