import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { PhoneNumber } from 'src/onboarding/entities/phone_numbers.entity';

import { Repository } from 'typeorm';

@Injectable({ scope: Scope.REQUEST })
export class AdminPhoneNumbersService extends TypeOrmCrudService<PhoneNumber> {
  // constructor(@InjectRepository(Proofs) repo) {
  //   super(repo);
  // }

  constructor(@Inject('CONNECTION') dataSource) {
    const phoneNumberRepo = new Repository<PhoneNumber>(
      PhoneNumber,
      dataSource.createEntityManager(),
    );
    super(phoneNumberRepo);
  }
}
