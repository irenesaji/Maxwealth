import { Inject, Injectable, Scope } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { SwitchFunds } from 'src/transaction_baskets/entities/switch_funds.entity';

@Injectable({ scope: Scope.REQUEST }) // here
export class SwitchFundsRepository extends Repository<SwitchFunds> {
  constructor(@Inject('CONNECTION') dataSource) {
    console.log('CONNECTIOONN');
    // console.log("REPOSITORY DATASOURCE", dataSource.createEntityManager());
    super(SwitchFunds, dataSource.createEntityManager());
  }
}
