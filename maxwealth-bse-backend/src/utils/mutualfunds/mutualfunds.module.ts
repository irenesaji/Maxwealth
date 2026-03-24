import { Module } from '@nestjs/common';
import { MutualfundsService } from './mutualfunds.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [MutualfundsService],
  exports: [MutualfundsService],
})
export class MutualfundsModule {}
