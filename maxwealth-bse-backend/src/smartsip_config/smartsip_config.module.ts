import { Module } from '@nestjs/common';
import { SmartsipConfigService } from './smartsip_config.service';
import { SmartsipConfigController } from './smartsip_config.controller';
import { MutualfundsModule } from 'src/utils/mutualfunds/mutualfunds.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SmartSipFunds } from './entities/smart_sip_funds.entity';
import { FintechModule } from 'src/utils/fintech/fintech.module';
import { SmartSipFundsRepository } from 'src/repositories/smart_sip_funds.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([SmartSipFunds]),
    MutualfundsModule,
    FintechModule,
  ],
  providers: [SmartsipConfigService, SmartSipFundsRepository],
  controllers: [SmartsipConfigController],
})
export class SmartsipConfigModule {}
