import { Inject, Injectable, Scope } from '@nestjs/common';
import { BsePurchaseRedemptionOrder } from 'src/transaction_baskets/entities/bsev1_purchase_order.entity';
import { BseXSipOrder } from 'src/transaction_baskets/entities/bsev1_xsip_order.entity';
import { Repository } from 'typeorm';

@Injectable({ scope: Scope.REQUEST })
export class BsePurchaseRedemOrderRepository extends Repository<BsePurchaseRedemptionOrder> {
  constructor(@Inject('CONNECTION') dataSource) {
    super(BsePurchaseRedemptionOrder, dataSource.createEntityManager());
  }
}
