import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { NotificationsModule } from 'src/utils/notifications/notifications.module';

import { Users } from './entities/users.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CustomEmailvalidation } from '../validators/custom_email.validation';
import { CustomPhonevalidation } from '../validators/custom_phone.validation';
import { ZohoModule } from 'src/utils/zoho/zoho.module';
import { CsvModule } from 'src/utils/csv/csv.module';
import { Msg91Module } from 'src/utils/msg91/msg91.module';
import { UsersRepository } from 'src/repositories/user.repository';
import { EnablexModule } from 'src/utils/enablex/enablex.module';
import { BrevoModule } from 'src/utils/brevo/brevo.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users]),
    NotificationsModule,
    ZohoModule,
    CsvModule,
    Msg91Module,
    EnablexModule,
    BrevoModule,
  ],
  controllers: [UsersController],
  providers: [
    UsersRepository,
    UsersService,
    CustomEmailvalidation,
    CustomPhonevalidation,
  ],
  exports: [UsersService, UsersRepository],
})
export class UsersModule {}
