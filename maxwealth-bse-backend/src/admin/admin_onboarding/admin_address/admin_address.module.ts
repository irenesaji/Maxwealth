import { Module } from '@nestjs/common';
import { AdminAddressService } from './admin_address.service';
import { AdminAddressController } from './admin_address.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAddressDetails } from 'src/onboarding/address/entities/user_address_details.entity';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from 'src/auth/guard/roles.guard';

@Module({
  imports: [TypeOrmModule.forFeature([UserAddressDetails])],
  providers: [
    AdminAddressService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  controllers: [AdminAddressController],
})
export class AdminAddressModule {}
