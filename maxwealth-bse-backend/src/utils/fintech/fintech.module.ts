import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserOnboardingDetails } from 'src/onboarding/entities/user_onboarding_details.entity';
import { FintechService } from './fintech.service';
import { Proofs } from 'src/onboarding/proofs/entities/proofs.entity';
import { UserReturnsHistory } from 'src/portfolio/entities/user_returns_history.entity';
import { ProofsRepository } from 'src/repositories/proofs.repository';
import { UserReturnsHistoryRepository } from 'src/repositories/user_returns_history.repository';
import { UserOnboardingDetailsRepository } from 'src/repositories/user_onboarding_details.repository';
import { UserAddressDetails } from 'src/onboarding/address/entities/user_address_details.entity';
import { UserNomineeDetails } from 'src/onboarding/nominee/entities/user-nominee-details.entity';
import { PhoneNumber } from 'src/onboarding/entities/phone_numbers.entity';
import { EmailAddress } from 'src/onboarding/entities/email_addresses.entity';
import { UserBankDetails } from 'src/onboarding/bank/entities/user_bank_details.entity';
import { UserAddressDetailsRepository } from 'src/repositories/user_address_details.repository';
import { PhoneNumberRepository } from 'src/repositories/phone_number.repository';
import { EmailAddressRepository } from 'src/repositories/email_address.repository';
import { UserBankDetailsRepository } from 'src/repositories/user_bank_details.repository';
import { UserNomineeDetailsRepository } from 'src/repositories/user_nominee_details.repository';
import { UsersRepository } from 'src/repositories/user.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserOnboardingDetails,
      Proofs,
      UserReturnsHistory,
      UserAddressDetails,
      UserNomineeDetails,
      PhoneNumber,
      EmailAddress,
      UserBankDetails,
    ]),
    HttpModule,
  ],
  providers: [
    FintechService,
    ProofsRepository,
    UsersRepository,
    UserReturnsHistoryRepository,
    UserOnboardingDetailsRepository,
    UserAddressDetailsRepository,
    UserNomineeDetailsRepository,
    UserBankDetailsRepository,
    EmailAddressRepository,
    PhoneNumberRepository,
  ],
  exports: [FintechService],
})
export class FintechModule {}
