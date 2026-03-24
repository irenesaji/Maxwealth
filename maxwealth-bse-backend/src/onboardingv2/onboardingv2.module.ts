import { Module } from '@nestjs/common';
import { Onboardingv2Service } from './onboardingv2.service';
import { Onboardingv2Controller } from './onboardingv2.controller';
import { PichainModule } from 'src/utils/pichain/pichain.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAddressDetails } from 'src/onboarding/address/entities/user_address_details.entity';
import { UserBankDetails } from 'src/onboarding/bank/entities/user_bank_details.entity';
import { EmailAddress } from 'src/onboarding/entities/email_addresses.entity';
import { PhoneNumber } from 'src/onboarding/entities/phone_numbers.entity';
import { UserOnboardingDetails } from 'src/onboarding/entities/user_onboarding_details.entity';
import { MastersModule } from 'src/onboarding/masters/masters.module';
import { UserNomineeDetails } from 'src/onboarding/nominee/entities/user-nominee-details.entity';
import { Purchase } from 'src/transaction_baskets/entities/purchases.entity';
import { TransactionBasketItems } from 'src/transaction_baskets/entities/transaction_basket_items.entity';
import { UsersModule } from 'src/users/users.module';
import { FintechModule } from 'src/utils/fintech/fintech.module';
import { SignzyModule } from 'src/utils/signzy/signzy.module';
import { KycStatusDetail } from 'src/onboarding/entities/kyc_status_details.entity';
import { EmailAddressRepository } from 'src/repositories/email_address.repository';
import { KycStatusDetailRepository } from 'src/repositories/kyc_status_details.repository';
import { PhoneNumberRepository } from 'src/repositories/phone_number.repository';
import { PurchaseRepository } from 'src/repositories/purchase.repository';
import { SignzyKycObjectRepository } from 'src/repositories/signzy_kyc_object.repository';
import { TransactionBasketItemsRepository } from 'src/repositories/transaction_basket_item.repository';
import { UserAddressDetailsRepository } from 'src/repositories/user_address_details.repository';
import { UserBankDetailsRepository } from 'src/repositories/user_bank_details.repository';
import { UserNomineeDetailsRepository } from 'src/repositories/user_nominee_details.repository';
import { UserOnboardingDetailsRepository } from 'src/repositories/user_onboarding_details.repository';
import { CamsModule } from 'src/utils/cams/cams.module';
import { CamsService } from 'src/utils/cams/cams.service';
import { CamsEncryptDecryptModule } from 'src/utils/cams_encrypt_decrypt/cams_encrypt_decrypt.module';
import { CamsEncryptDecryptService } from 'src/utils/cams_encrypt_decrypt/cams_encrypt_decrypt.service';
import { HttpModule } from '@nestjs/axios';
import { KycStatusRepository } from 'src/repositories/kyc_status.repository';
import { OnboardingModule } from 'src/onboarding/onboarding.module';
import { FintupleModule } from 'src/utils/fintuple/fintuple.module';

@Module({
  imports: [
    SignzyModule,
    TypeOrmModule.forFeature([
      EmailAddress,
      PhoneNumber,
      UserOnboardingDetails,
      TransactionBasketItems,
      UserAddressDetails,
      UserNomineeDetails,
      UserBankDetails,
      Purchase,
    ]),
    FintechModule,
    PichainModule,
    UsersModule,
    MastersModule,
    CamsModule,
    HttpModule,
    CamsEncryptDecryptModule,
    OnboardingModule,
    FintupleModule,
  ],
  controllers: [Onboardingv2Controller],
  providers: [
    Onboardingv2Service,
    CamsService,
    CamsEncryptDecryptService,
    KycStatusDetailRepository,
    SignzyKycObjectRepository,
    KycStatusDetail,
    UserOnboardingDetailsRepository,
    TransactionBasketItemsRepository,
    UserAddressDetailsRepository,
    KycStatusRepository,
    UserNomineeDetailsRepository,
    UserBankDetailsRepository,
    PurchaseRepository,
    PhoneNumberRepository,
    EmailAddressRepository,
  ],
  exports: [Onboardingv2Service],
})
export class Onboardingv2Module {}
