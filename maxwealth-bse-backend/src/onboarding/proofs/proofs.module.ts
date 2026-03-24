import { Module } from '@nestjs/common';
import { ProofsService } from './proofs.service';
import { ProofsController } from './proofs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Proofs } from './entities/proofs.entity';
import { UserOnboardingDetails } from '../entities/user_onboarding_details.entity';
import { FintechModule } from 'src/utils/fintech/fintech.module';
import { UsersModule } from 'src/users/users.module';
import { ProofsRepository } from 'src/repositories/proofs.repository';
import { UserOnboardingDetailsRepository } from 'src/repositories/user_onboarding_details.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Proofs]),
    TypeOrmModule.forFeature([UserOnboardingDetails]),
    FintechModule,
    UsersModule,
  ],
  providers: [ProofsService, ProofsRepository, UserOnboardingDetailsRepository],
  controllers: [ProofsController],
  exports: [ProofsService],
})
export class ProofsModule {}
