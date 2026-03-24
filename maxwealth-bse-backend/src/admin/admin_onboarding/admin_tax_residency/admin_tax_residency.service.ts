import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { TaxResidency } from 'src/onboarding/entities/tax_residency.entity';
import { Repository } from 'typeorm';

@Injectable({ scope: Scope.REQUEST })
export class AdminTaxResidencyService extends TypeOrmCrudService<TaxResidency> {
  // constructor(@InjectRepository(Proofs) repo) {
  //   super(repo);
  // }

  constructor(@Inject('CONNECTION') dataSource) {
    const taxRecidencyRepo = new Repository<TaxResidency>(
      TaxResidency,
      dataSource.createEntityManager(),
    );
    super(taxRecidencyRepo);
  }
}
