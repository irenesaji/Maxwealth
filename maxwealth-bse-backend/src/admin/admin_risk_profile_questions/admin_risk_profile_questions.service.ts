import { Inject, Injectable, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { RiskProfileQuestion } from 'src/risk_profiles/entities/risk_profile_questions.entity';
import { Repository } from 'typeorm';

@Injectable({ scope: Scope.REQUEST })
export class AdminRiskProfileQuestionsService extends TypeOrmCrudService<RiskProfileQuestion> {
  // constructor(@InjectRepository(RiskProfileQuestion) repo) {
  //   super(repo);
  // }

  constructor(@Inject('CONNECTION') dataSource) {
    const riskRepo = new Repository<RiskProfileQuestion>(
      RiskProfileQuestion,
      dataSource.createEntityManager(),
    );
    super(riskRepo);
  }
}
