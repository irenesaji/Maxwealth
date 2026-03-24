import { Module } from '@nestjs/common';
import { AdminPhoneNumbersService } from './admin_phone_numbers.service';
import { AdminPhoneNumbersController } from './admin_phone_numbers.controller';

@Module({
  providers: [AdminPhoneNumbersService],
  controllers: [AdminPhoneNumbersController],
})
export class AdminPhoneNumbersModule {}
