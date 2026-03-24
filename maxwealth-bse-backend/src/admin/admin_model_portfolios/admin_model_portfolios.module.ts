import { Module } from '@nestjs/common';
import { AdminModelPortfoliosService } from './admin_model_portfolios.service';
import { AdminModelPortfoliosController } from './admin_model_portfolios.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModelPortfolio } from 'src/model_portfolio/entities/model_portfolios.entity';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from 'src/auth/guard/roles.guard';

@Module({
  imports: [TypeOrmModule.forFeature([ModelPortfolio])],
  providers: [
    AdminModelPortfoliosService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  controllers: [AdminModelPortfoliosController],
})
export class AdminModelPortfoliosModule {}
