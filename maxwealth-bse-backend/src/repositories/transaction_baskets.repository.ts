import { Inject, Injectable, Scope } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { TransactionBaskets } from 'src/transaction_baskets/entities/transaction_baskets.entity';

@Injectable({ scope: Scope.REQUEST }) // here
export class TransactionBasketsRepository extends Repository<TransactionBaskets> {
  constructor(@Inject('CONNECTION') dataSource) {
    console.log('CONNECTIOONN');
    // console.log("REPOSITORY DATASOURCE", dataSource.createEntityManager());
    super(TransactionBaskets, dataSource.createEntityManager());
  }
}
