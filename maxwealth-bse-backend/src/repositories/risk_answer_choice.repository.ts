import { Inject, Injectable, Scope } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { RiskAnswerChoice } from 'src/risk_profiles/entities/risk_answer_choices.entity';

@Injectable({ scope: Scope.REQUEST }) // here
export class RiskAnswerChoiceRepository extends Repository<RiskAnswerChoice> {
  constructor(@Inject('CONNECTION') dataSource) {
    console.log('CONNECTIOONN');
    // console.log("REPOSITORY DATASOURCE", dataSource.createEntityManager());
    super(RiskAnswerChoice, dataSource.createEntityManager());
  }
}
