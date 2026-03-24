import { Module } from '@nestjs/common';
import { KraVerificationService } from './kra_verification.service';
import { KraVerificationController } from './kra_verification.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [KraVerificationController],
  providers: [KraVerificationService],
})
export class KraVerificationModule {}
