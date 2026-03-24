import { Module } from '@nestjs/common';
import { AdminEmailsService } from './admin_emails.service';
import { AdminEmailsController } from './admin_emails.controller';

@Module({
  providers: [AdminEmailsService],
  controllers: [AdminEmailsController],
})
export class AdminEmailsModule {}
