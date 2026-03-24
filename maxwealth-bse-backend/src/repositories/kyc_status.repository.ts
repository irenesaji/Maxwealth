import { Inject, Injectable, Scope } from '@nestjs/common';
import { Country } from 'src/onboarding/entities/countries.entity';
import { KycStatus } from 'src/onboardingv2/entities/kyc_status.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable({ scope: Scope.REQUEST }) // here
export class KycStatusRepository extends Repository<KycStatus> {
  constructor(@Inject('CONNECTION') dataSource) {
    super(KycStatus, dataSource.createEntityManager());
  }
}
