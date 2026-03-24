import { Module } from '@nestjs/common';
import { RazorpayService } from './razorpay.service';
import { RazorpayController } from './razorpay.controller';
import { RazorpayPennyDropRepository } from 'src/repositories/razorpay_penny_drop.repository';
import { HttpModule } from '@nestjs/axios';
import { PurchaseRepository } from 'src/repositories/purchase.repository';
import { MutualfundsModule } from '../mutualfunds/mutualfunds.module';
import { RzpOrdersRepository } from 'src/repositories/rzp_orders.repository';
import { RzpTransfersRepository } from 'src/repositories/rzp_transfers.repository';
import { UserBankDetailsRepository } from 'src/repositories/user_bank_details.repository';
import { RzpCustomerRepository } from 'src/repositories/rzp_customer.repository';

@Module({
  imports: [HttpModule, MutualfundsModule],
  providers: [
    RazorpayService,
    RzpCustomerRepository,
    RazorpayPennyDropRepository,
    UserBankDetailsRepository,
    PurchaseRepository,
    RzpOrdersRepository,
    RzpTransfersRepository,
  ],
  controllers: [RazorpayController],
  exports: [RazorpayService],
})
export class RazorpayModule {}
