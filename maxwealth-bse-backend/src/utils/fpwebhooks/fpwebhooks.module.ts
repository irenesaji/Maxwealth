import { Module } from '@nestjs/common';
import { FpwebhooksService } from './fpwebhooks.service';
import { FpwebhooksController } from './fpwebhooks.controller';
import { FintechModule } from '../fintech/fintech.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Purchase } from 'src/transaction_baskets/entities/purchases.entity';
import { TransactionBasketItems } from 'src/transaction_baskets/entities/transaction_basket_items.entity';
import { Users } from 'src/users/entities/users.entity';
import { Msg91Module } from '../msg91/msg91.module';
import { SwitchFunds } from 'src/transaction_baskets/entities/switch_funds.entity';
import { Redemption } from 'src/transaction_baskets/entities/redemptions.entity';
import { UserOnboardingDetails } from 'src/onboarding/entities/user_onboarding_details.entity';
import { Mandates } from 'src/mandates/entities/mandates.entity';
import { TransactionBasketItemsRepository } from 'src/repositories/transaction_basket_item.repository';
import { UsersRepository } from 'src/repositories/user.repository';
import { RedemptionRepository } from 'src/repositories/redemption.repository';
import { SwitchFundsRepository } from 'src/repositories/switch_fund.repository';
import { UserOnboardingDetailsRepository } from 'src/repositories/user_onboarding_details.repository';
import { MandatesRepository } from 'src/repositories/mandates.repository';
import { PurchaseRepository } from 'src/repositories/purchase.repository';
import { EnablexModule } from '../enablex/enablex.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Purchase,
      TransactionBasketItems,
      Users,
      Redemption,
      SwitchFunds,
      UserOnboardingDetails,
      Mandates,
    ]),
    FintechModule,
    Msg91Module,
    EnablexModule,
  ],
  providers: [
    FpwebhooksService,
    PurchaseRepository,
    TransactionBasketItemsRepository,
    UsersRepository,
    RedemptionRepository,
    SwitchFundsRepository,
    UserOnboardingDetailsRepository,
    MandatesRepository,
  ],
  controllers: [FpwebhooksController],
})
export class FpwebhooksModule {}
