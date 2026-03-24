import { Inject, Injectable, Scope } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Redemption } from 'src/transaction_baskets/entities/redemptions.entity';

@Injectable({ scope: Scope.REQUEST }) // here
export class RedemptionRepository extends Repository<Redemption> {
  constructor(@Inject('CONNECTION') dataSource) {
    console.log('CONNECTIOONN');
    // console.log("REPOSITORY DATASOURCE", dataSource.createEntityManager());
    super(Redemption, dataSource.createEntityManager());
  }
}
