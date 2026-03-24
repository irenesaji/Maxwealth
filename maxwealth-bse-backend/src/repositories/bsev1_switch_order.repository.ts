import { Inject, Injectable, Scope } from '@nestjs/common';
import { BseSwitchOrder } from 'src/transaction_baskets/entities/bsev1_switch_order.entity';
import { BseXSipOrder } from 'src/transaction_baskets/entities/bsev1_xsip_order.entity';
import { Repository } from 'typeorm';

@Injectable({ scope: Scope.REQUEST })
export class BseSwitchOrderRepository extends Repository<BseSwitchOrder> {
  constructor(@Inject('CONNECTION') dataSource) {
    super(BseSwitchOrder, dataSource.createEntityManager());
  }
}
