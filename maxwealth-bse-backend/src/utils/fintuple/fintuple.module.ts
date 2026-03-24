import { Module, forwardRef } from '@nestjs/common';
import { FintupleService } from './fintuple.service';
import { FintupleController } from './fintuple.controller';
import { HttpModule } from '@nestjs/axios';
import { UserOnboardingDetailsRepository } from 'src/repositories/user_onboarding_details.repository';

@Module({
  imports: [HttpModule],
  controllers: [FintupleController],
  providers: [FintupleService, UserOnboardingDetailsRepository],
  exports: [FintupleService],
})
export class FintupleModule {}
