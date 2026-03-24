import { Inject, Injectable, Scope } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { UserBankDetails } from 'src/onboarding/bank/entities/user_bank_details.entity';

@Injectable({ scope: Scope.REQUEST }) // here
export class UserBankDetailsRepository extends Repository<UserBankDetails> {
  constructor(@Inject('CONNECTION') dataSource) {
    console.log('CONNECTIOONN');
    // console.log("REPOSITORY DATASOURCE", dataSource.createEntityManager());
    super(UserBankDetails, dataSource.createEntityManager());
  }
}
