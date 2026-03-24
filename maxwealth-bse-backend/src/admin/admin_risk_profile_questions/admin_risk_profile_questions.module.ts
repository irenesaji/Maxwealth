import { Module } from '@nestjs/common';
import { AdminRiskProfileQuestionsService } from './admin_risk_profile_questions.service';
import { AdminRiskProfileQuestionsController } from './admin_risk_profile_questions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RiskProfileQuestion } from 'src/risk_profiles/entities/risk_profile_questions.entity';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from 'src/auth/guard/roles.guard';

@Module({
  imports: [TypeOrmModule.forFeature([RiskProfileQuestion])],
  providers: [
    AdminRiskProfileQuestionsService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  controllers: [AdminRiskProfileQuestionsController],
})
export class AdminRiskProfileQuestionsModule {}
