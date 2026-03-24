import { Module } from '@nestjs/common';
import { EnablexService } from './enablex.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SmsConfiguration } from 'src/users/entities/sms_configuration.entity';
import { SmsConfigurationRepository } from 'src/repositories/sms_configuration.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([SmsConfiguration]),
    HttpModule,
    ConfigModule,
  ],
  providers: [EnablexService, SmsConfigurationRepository],
  exports: [EnablexService, SmsConfigurationRepository],
})
export class EnablexModule {}
