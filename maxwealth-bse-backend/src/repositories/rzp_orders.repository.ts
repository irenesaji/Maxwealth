import { Inject, Injectable, Scope } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { RzpOrder } from 'src/utils/razorpay/entities/rzp_orders.entity';

@Injectable({ scope: Scope.REQUEST }) // here
export class RzpOrdersRepository extends Repository<RzpOrder> {
  constructor(@Inject('CONNECTION') dataSource) {
    console.log('CONNECTIOONN');
    // console.log("REPOSITORY DATASOURCE", dataSource.createEntityManager());
    super(RzpOrder, dataSource.createEntityManager());
  }
}
