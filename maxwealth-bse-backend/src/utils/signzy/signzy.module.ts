import { Module } from '@nestjs/common';
import { SignzyService } from './signzy.service';
import { HttpModule } from '@nestjs/axios';
import { SignzyKycObjectRepository } from 'src/repositories/signzy_kyc_object.repository';
import { UserOnboardingDetailsRepository } from 'src/repositories/user_onboarding_details.repository';
import { IncomeRangeRepository } from 'src/repositories/income_range.repository';
import { OccupationRepository } from 'src/repositories/occupation.repository';
import { KycStatusDetailRepository } from 'src/repositories/kyc_status_details.repository';
import { UserBankDetailsRepository } from 'src/repositories/user_bank_details.repository';

@Module({
  imports: [HttpModule],
  providers: [
    SignzyService,
    SignzyKycObjectRepository,
    KycStatusDetailRepository,
    UserOnboardingDetailsRepository,
    IncomeRangeRepository,
    OccupationRepository,
    UserBankDetailsRepository,
  ],
  exports: [SignzyService],
})
export class SignzyModule {}
