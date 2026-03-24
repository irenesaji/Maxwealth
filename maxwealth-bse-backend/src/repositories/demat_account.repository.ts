import { Inject, Injectable, Scope } from '@nestjs/common';
import { DematAccount } from 'src/onboarding/entities/demat_account.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable({ scope: Scope.REQUEST }) // here
export class DemantAccountRepository extends Repository<DematAccount> {
  constructor(@Inject('CONNECTION') dataSource) {
    super(DematAccount, dataSource.createEntityManager());
  }
}
