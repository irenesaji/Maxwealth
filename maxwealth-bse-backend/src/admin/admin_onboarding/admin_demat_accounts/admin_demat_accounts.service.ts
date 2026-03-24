import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { DematAccount } from 'src/onboarding/entities/demat_account.entity';
import { Repository } from 'typeorm';

@Injectable({ scope: Scope.REQUEST })
export class AdminDematAccountsService extends TypeOrmCrudService<DematAccount> {
  // constructor(@InjectRepository(Proofs) repo) {
  //   super(repo);
  // }

  constructor(@Inject('CONNECTION') dataSource) {
    const dematAccountRepo = new Repository<DematAccount>(
      DematAccount,
      dataSource.createEntityManager(),
    );
    super(dematAccountRepo);
  }
}
