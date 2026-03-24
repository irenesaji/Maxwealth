import { Inject, Injectable, Scope } from '@nestjs/common';
import { DematAccount } from 'src/onboarding/entities/demat_account.entity';
import { DistributorLogo } from 'src/portfolio/entities/distributor_logo.entity';
import { Repository } from 'typeorm';

@Injectable({ scope: Scope.REQUEST })
export class DistributorLogoRepository extends Repository<DistributorLogo> {
  constructor(@Inject('CONNECTION') dataSource) {
    super(DistributorLogo, dataSource.createEntityManager());
  }
}
