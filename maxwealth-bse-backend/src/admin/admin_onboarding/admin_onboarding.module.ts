import { Module } from '@nestjs/common';
import { AdminOnboardingService } from './admin_onboarding.service';
import { AdminOnboardingController } from './admin_onboarding.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserOnboardingDetails } from 'src/onboarding/entities/user_onboarding_details.entity';
import { AdminAddressModule } from './admin_address/admin_address.module';
import { AdminNomineeModule } from './admin_nominee/admin_nominee.module';
import { AdminBankModule } from './admin_bank/admin_bank.module';
import { AdminProofsModule } from './admin_proofs/admin_proofs.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { AdminTaxResidencyModule } from './admin_tax_residency/admin_tax_residency.module';
import { AdminPhoneNumbersModule } from './admin_phone_numbers/admin_phone_numbers.module';
import { AdminEmailsModule } from './admin_emails/admin_emails.module';
import { UserOnboardingDetailsRepository } from 'src/repositories/user_onboarding_details.repository';
import { UsersModule } from 'src/users/users.module';
import { UsersRepository } from 'src/repositories/user.repository';

@Module({
  imports: [
    AdminAddressModule,
    AdminNomineeModule,
    AdminBankModule,
    AdminProofsModule,
    AdminTaxResidencyModule,
    AdminPhoneNumbersModule,
    AdminEmailsModule,
    UsersModule,
  ],
  providers: [
    AdminOnboardingService,
    UserOnboardingDetailsRepository,
    UsersRepository,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  controllers: [AdminOnboardingController],
})
export class AdminOnboardingModule {}
