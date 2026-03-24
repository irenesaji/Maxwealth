import { Inject, Injectable, Scope } from '@nestjs/common';
import { PhoneNumber } from 'src/onboarding/entities/phone_numbers.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable({ scope: Scope.REQUEST }) // here
export class PhoneNumberRepository extends Repository<PhoneNumber> {
  constructor(@Inject('CONNECTION') dataSource) {
    console.log('CONNECTIOONN');
    // console.log("REPOSITORY DATASOURCE", dataSource.createEntityManager());
    super(PhoneNumber, dataSource.createEntityManager());
  }
}
