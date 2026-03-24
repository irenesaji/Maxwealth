import { Inject, Injectable, Scope } from '@nestjs/common';
import { MfSwitchPlan } from 'src/transaction_baskets/entities/mf_switch_plan.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable({ scope: Scope.REQUEST }) // here
export class MfSwitchPlanRepository extends Repository<MfSwitchPlan> {
  constructor(@Inject('CONNECTION') dataSource) {
    console.log('CONNECTIOONN');
    // console.log("REPOSITORY DATASOURCE", dataSource.createEntityManager());
    super(MfSwitchPlan, dataSource.createEntityManager());
  }
}
