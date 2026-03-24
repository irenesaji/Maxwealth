import { Inject, Injectable, Scope } from '@nestjs/common';
import { TaxResidency } from 'src/onboarding/entities/tax_residency.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable({ scope: Scope.REQUEST }) // here
export class TaxResidencyRepository extends Repository<TaxResidency> {
  constructor(@Inject('CONNECTION') dataSource) {
    super(TaxResidency, dataSource.createEntityManager());
  }
}
