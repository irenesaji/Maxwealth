import { Inject, Injectable, Scope } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Purchase } from 'src/transaction_baskets/entities/purchases.entity';

@Injectable({ scope: Scope.REQUEST }) // here
export class PurchaseRepository extends Repository<Purchase> {
  constructor(@Inject('CONNECTION') dataSource) {
    console.log('CONNECTIOONN');
    // console.log("REPOSITORY DATASOURCE", dataSource.createEntityManager());
    super(Purchase, dataSource.createEntityManager());
  }
}
