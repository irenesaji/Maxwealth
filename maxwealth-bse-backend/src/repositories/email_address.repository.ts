import { Inject, Injectable, Scope } from '@nestjs/common';
import { EmailAddress } from 'src/onboarding/entities/email_addresses.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable({ scope: Scope.REQUEST }) // here
export class EmailAddressRepository extends Repository<EmailAddress> {
  constructor(@Inject('CONNECTION') dataSource) {
    console.log('CONNECTIOONN');
    super(EmailAddress, dataSource.createEntityManager());
  }
}
