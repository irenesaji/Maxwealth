import { Inject, Injectable, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { RiskAnswerWeightage } from 'src/risk_profiles/entities/risk_answer_weightages.entity';
import { Repository } from 'typeorm';

@Injectable({ scope: Scope.REQUEST })
export class AdminRiskAnswerWeightagesService extends TypeOrmCrudService<RiskAnswerWeightage> {
  // constructor(@InjectRepository(RiskAnswerWeightage) repo) {
  //   super(repo);
  // }

  constructor(@Inject('CONNECTION') dataSource) {
    const usersRepo = new Repository<RiskAnswerWeightage>(
      RiskAnswerWeightage,
      dataSource.createEntityManager(),
    );
    super(usersRepo);
  }
}
