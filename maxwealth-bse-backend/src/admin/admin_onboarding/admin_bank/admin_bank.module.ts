import { Module } from '@nestjs/common';
import { AdminBankService } from './admin_bank.service';
import { AdminBankController } from './admin_bank.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserBankDetails } from 'src/onboarding/bank/entities/user_bank_details.entity';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from 'src/auth/guard/roles.guard';

@Module({
  imports: [TypeOrmModule.forFeature([UserBankDetails])],
  providers: [
    AdminBankService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  controllers: [AdminBankController],
})
export class AdminBankModule {}
