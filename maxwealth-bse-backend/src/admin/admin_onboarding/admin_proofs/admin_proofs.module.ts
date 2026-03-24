import { Module } from '@nestjs/common';
import { AdminProofsService } from './admin_proofs.service';
import { AdminProofsController } from './admin_proofs.controller';
import { UsersModule } from 'src/users/users.module';
import { ProofsRepository } from 'src/repositories/proofs.repository';
import { UserOnboardingDetailsRepository } from 'src/repositories/user_onboarding_details.repository';

@Module({
  imports: [UsersModule],
  providers: [
    AdminProofsService,
    ProofsRepository,
    UserOnboardingDetailsRepository,
  ],
  controllers: [AdminProofsController],
})
export class AdminProofsModule {}
