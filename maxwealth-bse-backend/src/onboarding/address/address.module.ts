import { Module } from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAddressDetails } from './entities/user_address_details.entity';
import { UsersModule } from 'src/users/users.module';
import { UserOnboardingDetails } from '../entities/user_onboarding_details.entity';
import { FintechModule } from 'src/utils/fintech/fintech.module';
import { ProofsModule } from '../proofs/proofs.module';
import { UserAddressDetailsRepository } from 'src/repositories/user_address_details.repository';
import { UserOnboardingDetailsRepository } from 'src/repositories/user_onboarding_details.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserAddressDetails]),
    TypeOrmModule.forFeature([UserOnboardingDetails]),
    UsersModule,
    FintechModule,
    ProofsModule,
  ],
  providers: [
    AddressService,
    UserAddressDetailsRepository,
    UserOnboardingDetailsRepository,
  ],
  controllers: [AddressController],
})
export class AddressModule {}
