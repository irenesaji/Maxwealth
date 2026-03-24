import { Inject, Injectable, Scope } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { KycStatusDetail } from 'src/onboarding/entities/kyc_status_details.entity';
import { KycAccountType } from 'src/onboarding/entities/kyc_account_types.entity';

@Injectable({ scope: Scope.REQUEST }) // here
export class KycAccountTypeRepository extends Repository<KycAccountType> {
  constructor(@Inject('CONNECTION') dataSource) {
    console.log('CONNECTIOONN');
    // console.log("REPOSITORY DATASOURCE", dataSource.createEntityManager());
    super(KycAccountType, dataSource.createEntityManager());
  }
}
