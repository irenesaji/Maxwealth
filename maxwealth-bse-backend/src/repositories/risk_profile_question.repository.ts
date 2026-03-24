import { Inject, Injectable, Scope } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { RiskProfileQuestion } from 'src/risk_profiles/entities/risk_profile_questions.entity';

@Injectable({ scope: Scope.REQUEST }) // here
export class RiskProfileQuestionRepository extends Repository<RiskProfileQuestion> {
  constructor(@Inject('CONNECTION') dataSource) {
    console.log('CONNECTIOONN');
    // console.log("REPOSITORY DATASOURCE", dataSource.createEntityManager());
    super(RiskProfileQuestion, dataSource.createEntityManager());
  }
}
