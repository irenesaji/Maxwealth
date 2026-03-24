import { Inject, Injectable, Scope } from '@nestjs/common';
import { MfRedemptionPlan } from 'src/transaction_baskets/entities/mf_redemption_plan.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable({ scope: Scope.REQUEST }) // here
export class MfRedemptionPlanRepository extends Repository<MfRedemptionPlan> {
  constructor(@Inject('CONNECTION') dataSource) {
    console.log('CONNECTIOONN');
    // console.log("REPOSITORY DATASOURCE", dataSource.createEntityManager());
    super(MfRedemptionPlan, dataSource.createEntityManager());
  }
}
