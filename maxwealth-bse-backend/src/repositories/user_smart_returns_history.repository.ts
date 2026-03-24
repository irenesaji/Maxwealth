import { Inject, Injectable, Scope } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { UserSmartReturnsHistory } from 'src/portfolio/entities/user_smart_returns_history.entity';

@Injectable({ scope: Scope.REQUEST }) // here
export class UserSmartReturnsHistoryRepository extends Repository<UserSmartReturnsHistory> {
  constructor(@Inject('CONNECTION') dataSource) {
    console.log('CONNECTIOONN');
    // console.log("REPOSITORY DATASOURCE", dataSource.createEntityManager());
    super(UserSmartReturnsHistory, dataSource.createEntityManager());
  }
}
