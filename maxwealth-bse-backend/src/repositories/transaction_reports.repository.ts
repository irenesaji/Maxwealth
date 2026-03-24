import { Inject, Injectable, Scope } from '@nestjs/common';
import { TransactionReports } from 'src/investor-details/entities/transaction-details.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable({ scope: Scope.REQUEST }) // here
export class TransactionReportsRepository extends Repository<TransactionReports> {
  constructor(@Inject('CONNECTION') dataSource) {
    console.log('CONNECTIOONN');
    // console.log("REPOSITORY DATASOURCE", dataSource.createEntityManager());
    super(TransactionReports, dataSource.createEntityManager());
  }
}
