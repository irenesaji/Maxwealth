import { Module } from '@nestjs/common';
import { AdminDematAccountsService } from './admin_demat_accounts.service';
import { AdminDematAccountsController } from './admin_demat_accounts.controller';

@Module({
  providers: [AdminDematAccountsService],
  controllers: [AdminDematAccountsController],
})
export class AdminDematAccountsModule {}
