import { Module } from '@nestjs/common';
import { AdminRiskAnswerChoicesService } from './admin_risk_answer_choices.service';
import { AdminRiskAnswerChoicesController } from './admin_risk_answer_choices.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RiskAnswerChoice } from 'src/risk_profiles/entities/risk_answer_choices.entity';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from 'src/auth/guard/roles.guard';

@Module({
  imports: [TypeOrmModule.forFeature([RiskAnswerChoice])],
  providers: [
    AdminRiskAnswerChoicesService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  controllers: [AdminRiskAnswerChoicesController],
})
export class AdminRiskAnswerChoicesModule {}
