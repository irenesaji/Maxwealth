import { Inject, Injectable, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { Goal } from 'src/goals/entities/goals.entity';
import { Repository } from 'typeorm';

@Injectable({ scope: Scope.REQUEST })
export class AdminGoalsService extends TypeOrmCrudService<Goal> {
  // constructor(@InjectRepository(Goal) repo) {
  //   super(repo);
  // }

  constructor(@Inject('CONNECTION') dataSource) {
    const goalRepo = new Repository<Goal>(
      Goal,
      dataSource.createEntityManager(),
    );
    super(goalRepo);
  }
}
