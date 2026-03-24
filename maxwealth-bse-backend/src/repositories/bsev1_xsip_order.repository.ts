import { Inject, Injectable, Scope } from '@nestjs/common';
import { BseXSipOrder } from 'src/transaction_baskets/entities/bsev1_xsip_order.entity';
import { Repository } from 'typeorm';

@Injectable({ scope: Scope.REQUEST })
export class BseXSipOrderRepository extends Repository<BseXSipOrder> {
  constructor(@Inject('CONNECTION') dataSource) {
    super(BseXSipOrder, dataSource.createEntityManager());
  }
}
