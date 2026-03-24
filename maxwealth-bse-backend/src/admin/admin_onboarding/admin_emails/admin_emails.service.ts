import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { EmailAddress } from 'src/onboarding/entities/email_addresses.entity';
import { Repository } from 'typeorm';

@Injectable({ scope: Scope.REQUEST })
export class AdminEmailsService extends TypeOrmCrudService<EmailAddress> {
  // constructor(@InjectRepository(Proofs) repo) {
  //   super(repo);
  // }

  constructor(@Inject('CONNECTION') dataSource) {
    const emailAddressRepo = new Repository<EmailAddress>(
      EmailAddress,
      dataSource.createEntityManager(),
    );
    super(emailAddressRepo);
  }
}
