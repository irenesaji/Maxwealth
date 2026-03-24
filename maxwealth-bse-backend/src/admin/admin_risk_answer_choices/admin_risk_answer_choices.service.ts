import { Inject, Injectable, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { RiskAnswerChoice } from 'src/risk_profiles/entities/risk_answer_choices.entity';
import { Repository } from 'typeorm';

@Injectable({ scope: Scope.REQUEST })
export class AdminRiskAnswerChoicesService extends TypeOrmCrudService<RiskAnswerChoice> {
  // constructor(@InjectRepository(RiskAnswerChoice) repo) {
  //   super(repo);
  // }

  constructor(@Inject('CONNECTION') dataSource) {
    const riskAnswerRepo = new Repository<RiskAnswerChoice>(
      RiskAnswerChoice,
      dataSource.createEntityManager(),
    );
    super(riskAnswerRepo);
  }
}
