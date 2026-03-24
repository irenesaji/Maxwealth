import { Inject, Injectable, Scope } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { RiskUserQuiz } from 'src/risk_profiles/entities/risk_user_quizes.entity';

@Injectable({ scope: Scope.REQUEST }) // here
export class RiskUserQuizRepository extends Repository<RiskUserQuiz> {
  constructor(@Inject('CONNECTION') dataSource) {
    console.log('CONNECTIOONN');
    // console.log("REPOSITORY DATASOURCE", dataSource.createEntityManager());
    super(RiskUserQuiz, dataSource.createEntityManager());
  }
}
