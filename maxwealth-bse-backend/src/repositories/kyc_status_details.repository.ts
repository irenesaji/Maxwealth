import { Inject, Injectable, Scope } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { KycStatusDetail } from 'src/onboarding/entities/kyc_status_details.entity';

@Injectable({ scope: Scope.REQUEST }) // here
export class KycStatusDetailRepository extends Repository<KycStatusDetail> {
  constructor(@Inject('CONNECTION') dataSource) {
    console.log('CONNECTIOONN');
    // console.log("REPOSITORY DATASOURCE", dataSource.createEntityManager());
    super(KycStatusDetail, dataSource.createEntityManager());
  }
}
