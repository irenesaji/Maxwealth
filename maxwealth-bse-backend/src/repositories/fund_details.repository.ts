import { Inject, Injectable, Scope } from '@nestjs/common';
import { FundDetail } from 'src/fund_details/entities/fund_detail.entity';
import { MfPurchasePlan } from 'src/transaction_baskets/entities/mf_purchase_plan.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable({ scope: Scope.REQUEST }) // here
export class FundDetailsRepository extends Repository<FundDetail> {
  constructor(@Inject('CONNECTION') dataSource) {
    console.log('CONNECTIOONN');
    // console.log("REPOSITORY DATASOURCE", dataSource.createEntityManager());
    super(FundDetail, dataSource.createEntityManager());
  }
}
