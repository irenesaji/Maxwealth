import { Module } from '@nestjs/common';
import { AdminNomineeService } from './admin_nominee.service';
import { AdminNomineeController } from './admin_nominee.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserNomineeDetails } from 'src/onboarding/nominee/entities/user-nominee-details.entity';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { UserOnboardingDetailsRepository } from 'src/repositories/user_onboarding_details.repository';
import { UserNomineeDetailsRepository } from 'src/repositories/user_nominee_details.repository';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserNomineeDetails]), UsersModule],
  providers: [
    AdminNomineeService,
    UserOnboardingDetailsRepository,
    UserNomineeDetailsRepository,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  controllers: [AdminNomineeController],
})
export class AdminNomineeModule {}
