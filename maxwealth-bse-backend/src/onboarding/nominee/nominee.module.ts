import { Module } from '@nestjs/common';
import { NomineeService } from './nominee.service';
import { NomineeController } from './nominee.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserNomineeDetails } from './entities/user-nominee-details.entity';
import { UsersModule } from 'src/users/users.module';
import { UserOnboardingDetails } from '../entities/user_onboarding_details.entity';
import { UserOnboardingDetailsRepository } from 'src/repositories/user_onboarding_details.repository';
import { UserNomineeDetailsRepository } from 'src/repositories/user_nominee_details.repository';
import { FintechModule } from 'src/utils/fintech/fintech.module';
import { KycStatusDetailRepository } from 'src/repositories/kyc_status_details.repository';
import { Bsev1NomineeRelationshipCodeRepository } from 'src/repositories/bse_v1_nominee_relationship_code.repository';
import { Bsev1Module } from 'src/utils/bsev1/bsev1.module';
import { Bsev1Service } from 'src/utils/bsev1/bsev1.service';
import { HttpModule } from '@nestjs/axios';
// import { Bsev1Service } from 'src/utils/bsev1/bsev1.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserNomineeDetails, UserOnboardingDetails]),
    UsersModule,
    FintechModule,
    Bsev1Module,
    HttpModule,
  ],
  providers: [
    NomineeService,
    Bsev1Service,
    KycStatusDetailRepository,
    UserNomineeDetailsRepository,
    UserOnboardingDetailsRepository,
    Bsev1NomineeRelationshipCodeRepository,
  ],
  controllers: [NomineeController],
})
export class NomineeModule {}
