import { Inject, Injectable, Scope } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { TransactionBasketItems } from 'src/transaction_baskets/entities/transaction_basket_items.entity';

@Injectable({ scope: Scope.REQUEST }) // here
export class TransactionBasketItemsRepository extends Repository<TransactionBasketItems> {
  constructor(@Inject('CONNECTION') dataSource) {
    console.log('CONNECTIOONN');
    // console.log("REPOSITORY DATASOURCE", dataSource.createEntityManager());
    super(TransactionBasketItems, dataSource.createEntityManager());
  }
}
