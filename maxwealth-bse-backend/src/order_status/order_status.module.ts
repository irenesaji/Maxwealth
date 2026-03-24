import { Module } from '@nestjs/common';
import { OrderStatusService } from './order_status.service';
import { OrderStatusController } from './order_status.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionBaskets } from 'src/transaction_baskets/entities/transaction_baskets.entity';
import { TransactionBasketItems } from 'src/transaction_baskets/entities/transaction_basket_items.entity';
import { Purchase } from 'src/transaction_baskets/entities/purchases.entity';
import { SwitchFunds } from 'src/transaction_baskets/entities/switch_funds.entity';
import { Redemption } from 'src/transaction_baskets/entities/redemptions.entity';
import { Mandates } from 'src/mandates/entities/mandates.entity';
import { MutualfundsModule } from 'src/utils/mutualfunds/mutualfunds.module';
import { TransactionBasketsRepository } from 'src/repositories/transaction_baskets.repository';
import { TransactionBasketItemsRepository } from 'src/repositories/transaction_basket_item.repository';
import { PurchaseRepository } from 'src/repositories/purchase.repository';
import { SwitchFundsRepository } from 'src/repositories/switch_fund.repository';
import { RedemptionRepository } from 'src/repositories/redemption.repository';
import { MandatesRepository } from 'src/repositories/mandates.repository';
import { MfPurchasePlanRepository } from 'src/repositories/mf_purchase_plan.repository';
import { MfRedemptionPlanRepository } from 'src/repositories/mf_redemption_plan.repository';
import { MfSwitchPlanRepository } from 'src/repositories/mf_switch_plan.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TransactionBaskets,
      TransactionBasketItems,
      Purchase,
      SwitchFunds,
      Redemption,
      Mandates,
    ]),
    MutualfundsModule,
  ],
  providers: [
    OrderStatusService,
    MfRedemptionPlanRepository,
    MfSwitchPlanRepository,
    MfPurchasePlanRepository,
    TransactionBasketsRepository,
    TransactionBasketItemsRepository,
    PurchaseRepository,
    SwitchFundsRepository,
    RedemptionRepository,
    MandatesRepository,
  ],
  controllers: [OrderStatusController],
})
export class OrderStatusModule {}
