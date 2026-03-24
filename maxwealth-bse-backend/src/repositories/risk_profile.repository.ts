import { Inject, Injectable, Scope } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { RiskProfile } from 'src/risk_profiles/entities/risk_profiles.entity';

@Injectable({ scope: Scope.REQUEST }) // here
export class RiskProfileRepository extends Repository<RiskProfile> {
  constructor(@Inject('CONNECTION') dataSource) {
    console.log('CONNECTIOONN');
    // console.log("REPOSITORY DATASOURCE", dataSource.createEntityManager());
    super(RiskProfile, dataSource.createEntityManager());
  }
}
