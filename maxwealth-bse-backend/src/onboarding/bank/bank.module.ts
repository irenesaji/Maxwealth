import { Module } from '@nestjs/common';
import { BankService } from './bank.service';
import { BankController } from './bank.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserBankDetails } from './entities/user_bank_details.entity';
import { UserOnboardingDetails } from '../entities/user_onboarding_details.entity';
import { UsersModule } from 'src/users/users.module';
import { FintechModule } from 'src/utils/fintech/fintech.module';
import { UserAddressDetails } from '../address/entities/user_address_details.entity';
import { UserNomineeDetails } from '../nominee/entities/user-nominee-details.entity';
import { Pennydrops } from './entities/pennydrops.entity';
import { PichainModule } from 'src/utils/pichain/pichain.module';
import { UserBankDetailsRepository } from 'src/repositories/user_bank_details.repository';
import { PennydropsRepository } from 'src/repositories/pennydrops.repository';
import { UserOnboardingDetailsRepository } from 'src/repositories/user_onboarding_details.repository';
import { UserAddressDetailsRepository } from 'src/repositories/user_address_details.repository';
import { UserNomineeDetailsRepository } from 'src/repositories/user_nominee_details.repository';
import { SignzyKycObjectRepository } from 'src/repositories/signzy_kyc_object.repository';
import { KycStatusDetailRepository } from 'src/repositories/kyc_status_details.repository';
import { RazorpayModule } from 'src/utils/razorpay/razorpay.module';
import { SignzyModule } from 'src/utils/signzy/signzy.module';
import { Bsev1Service } from 'src/utils/bsev1/bsev1.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserBankDetails, Pennydrops]),
    TypeOrmModule.forFeature([UserOnboardingDetails]),
    TypeOrmModule.forFeature([UserAddressDetails]),
    TypeOrmModule.forFeature([UserNomineeDetails]),
    UsersModule,
    RazorpayModule,
    SignzyModule,
    FintechModule,
    PichainModule,
    HttpModule,
  ],
  providers: [
    BankService,
    Bsev1Service,
    KycStatusDetailRepository,
    SignzyKycObjectRepository,
    UserBankDetailsRepository,
    PennydropsRepository,
    UserOnboardingDetailsRepository,
    UserAddressDetailsRepository,
    UserNomineeDetailsRepository,
  ],
  controllers: [BankController],
  exports: [BankService],
})
export class BankModule {}
