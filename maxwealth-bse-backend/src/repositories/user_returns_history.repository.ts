import { Inject, Injectable, Scope } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { UserReturnsHistory } from 'src/portfolio/entities/user_returns_history.entity';

@Injectable({ scope: Scope.REQUEST }) // here
export class UserReturnsHistoryRepository extends Repository<UserReturnsHistory> {
  constructor(@Inject('CONNECTION') dataSource) {
    console.log('CONNECTIOONN');
    // console.log("REPOSITORY DATASOURCE", dataSource.createEntityManager());
    super(UserReturnsHistory, dataSource.createEntityManager());
  }
}
