import { Inject, Injectable, Scope } from '@nestjs/common';
import { RazorpayPennyDrops } from 'src/utils/razorpay/entities/razorpay_penny_drops.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable({ scope: Scope.REQUEST }) // here
export class RazorpayPennyDropRepository extends Repository<RazorpayPennyDrops> {
  constructor(@Inject('CONNECTION') dataSource) {
    console.log('CONNECTIOONN');
    // console.log("REPOSITORY DATASOURCE", dataSource.createEntityManager());
    super(RazorpayPennyDrops, dataSource.createEntityManager());
  }
}
