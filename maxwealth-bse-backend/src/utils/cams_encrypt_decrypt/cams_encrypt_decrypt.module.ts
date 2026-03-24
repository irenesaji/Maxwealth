import { Module } from '@nestjs/common';
import { CamsEncryptDecryptService } from './cams_encrypt_decrypt.service';
import { CamsEncryptDecryptController } from './cams_encrypt_decrypt.controller';
import { Type } from 'class-transformer';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserOnboardingDetails } from 'src/onboarding/entities/user_onboarding_details.entity';
import { UserOnboardingDetailsRepository } from 'src/repositories/user_onboarding_details.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserOnboardingDetails])],
  controllers: [CamsEncryptDecryptController],
  providers: [CamsEncryptDecryptService, UserOnboardingDetailsRepository],
})
export class CamsEncryptDecryptModule {}
