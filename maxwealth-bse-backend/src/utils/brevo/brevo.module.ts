import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailConfiguration } from 'src/users/entities/email_configuration.entity';
import { BrevoService } from './brevo.service';
import { EmailConfigurationRepository } from 'src/repositories/email_configuration.repository';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([EmailConfiguration]),
    HttpModule,
    ConfigModule,
  ],
  providers: [BrevoService, EmailConfigurationRepository],
  exports: [BrevoService, EmailConfigurationRepository],
})
export class BrevoModule {}
