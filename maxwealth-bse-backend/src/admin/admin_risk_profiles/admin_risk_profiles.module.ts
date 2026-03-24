import { Module } from '@nestjs/common';
import { AdminRiskProfilesService } from './admin_risk_profiles.service';
import { AdminRiskProfilesController } from './admin_risk_profiles.controller';
import { RiskProfile } from 'src/risk_profiles/entities/risk_profiles.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from 'src/auth/guard/roles.guard';

@Module({
  imports: [TypeOrmModule.forFeature([RiskProfile])],
  providers: [
    AdminRiskProfilesService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  controllers: [AdminRiskProfilesController],
})
export class AdminRiskProfilesModule {}
