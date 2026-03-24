import { Inject, Injectable, Scope } from '@nestjs/common';
import { UserReturnsHistoryVerison2 } from 'src/portfolio/entities/user_return_history_v2.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable({ scope: Scope.REQUEST }) // here
export class UserReturnsHistoryVersion2Repository extends Repository<UserReturnsHistoryVerison2> {
  constructor(@Inject('CONNECTION') dataSource) {
    console.log('CONNECTIOONN');
    // console.log("REPOSITORY DATASOURCE", dataSource.createEntityManager());
    super(UserReturnsHistoryVerison2, dataSource.createEntityManager());
  }
}
