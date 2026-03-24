import { Inject, Injectable, Scope } from '@nestjs/common';
import { BseSwitchOrder } from 'src/transaction_baskets/entities/bsev1_switch_order.entity';
import { BseXSipOrder } from 'src/transaction_baskets/entities/bsev1_xsip_order.entity';
import { UniqueReferenceNo } from 'src/transaction_baskets/entities/unique_reference_no.entity';
import { Repository } from 'typeorm';

@Injectable({ scope: Scope.REQUEST })
export class UniqueReferenceNoRepository extends Repository<UniqueReferenceNo> {
  constructor(@Inject('CONNECTION') dataSource) {
    super(UniqueReferenceNo, dataSource.createEntityManager());
  }
}
