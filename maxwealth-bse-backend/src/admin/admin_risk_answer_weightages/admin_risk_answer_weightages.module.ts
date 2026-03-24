import { Module } from '@nestjs/common';
import { AdminRiskAnswerWeightagesService } from './admin_risk_answer_weightages.service';
import { AdminRiskAnswerWeightagesController } from './admin_risk_answer_weightages.controller';
import { RiskAnswerWeightage } from 'src/risk_profiles/entities/risk_answer_weightages.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from 'src/auth/guard/roles.guard';

@Module({
  imports: [TypeOrmModule.forFeature([RiskAnswerWeightage])],
  providers: [
    AdminRiskAnswerWeightagesService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  controllers: [AdminRiskAnswerWeightagesController],
})
export class AdminRiskAnswerWeightagesModule {}
