import { Inject, Injectable, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { RiskProfile } from 'src/risk_profiles/entities/risk_profiles.entity';
import { Repository } from 'typeorm';

@Injectable({ scope: Scope.REQUEST })
export class AdminRiskProfilesService extends TypeOrmCrudService<RiskProfile> {
  // constructor(@InjectRepository(RiskProfile) repo) {
  //   super(repo);
  // }

  constructor(@Inject('CONNECTION') dataSource) {
    const riskRepo = new Repository<RiskProfile>(
      RiskProfile,
      dataSource.createEntityManager(),
    );
    super(riskRepo);
  }
}
