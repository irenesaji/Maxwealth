import { Module } from '@nestjs/common';
import { CamsService } from './cams.service';
import { CamsController } from './cams.controller';
import { HttpModule } from '@nestjs/axios';
import { CamsEncryptDecryptModule } from '../cams_encrypt_decrypt/cams_encrypt_decrypt.module';
import { CamsEncryptDecryptService } from '../cams_encrypt_decrypt/cams_encrypt_decrypt.service';
import { UserOnboardingDetailsRepository } from 'src/repositories/user_onboarding_details.repository';

@Module({
  imports: [HttpModule, CamsEncryptDecryptModule],
  controllers: [CamsController],
  providers: [
    CamsService,
    CamsEncryptDecryptService,
    UserOnboardingDetailsRepository,
  ],
  exports: [CamsService],
})
export class CamsModule {}
