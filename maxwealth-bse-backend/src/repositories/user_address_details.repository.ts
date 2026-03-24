import { Inject, Injectable, Scope } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { UserAddressDetails } from 'src/onboarding/address/entities/user_address_details.entity';

@Injectable({ scope: Scope.REQUEST }) // here
export class UserAddressDetailsRepository extends Repository<UserAddressDetails> {
  constructor(@Inject('CONNECTION') dataSource) {
    console.log('CONNECTIOONN');
    // console.log("REPOSITORY DATASOURCE", dataSource.createEntityManager());
    super(UserAddressDetails, dataSource.createEntityManager());
  }
}
