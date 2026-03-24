import { Inject, Injectable, Scope } from '@nestjs/common';
import { MfPurchasePlan } from 'src/transaction_baskets/entities/mf_purchase_plan.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable({ scope: Scope.REQUEST }) // here
export class MfPurchasePlanRepository extends Repository<MfPurchasePlan> {
  constructor(@Inject('CONNECTION') dataSource) {
    console.log('CONNECTIOONN');
    // console.log("REPOSITORY DATASOURCE", dataSource.createEntityManager());
    super(MfPurchasePlan, dataSource.createEntityManager());
  }
}
