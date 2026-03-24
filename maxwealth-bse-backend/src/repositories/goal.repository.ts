import { Inject, Injectable, Scope } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Goal } from 'src/goals/entities/goals.entity';

@Injectable({ scope: Scope.REQUEST }) // here
export class GoalRepository extends Repository<Goal> {
  constructor(@Inject('CONNECTION') dataSource) {
    console.log('CONNECTIOONN');
    // console.log("REPOSITORY DATASOURCE", dataSource.createEntityManager());
    super(Goal, dataSource.createEntityManager());
  }
}
