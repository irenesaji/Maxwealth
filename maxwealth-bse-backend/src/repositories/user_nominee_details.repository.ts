import { Inject, Injectable, Scope } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { UserNomineeDetails } from 'src/onboarding/nominee/entities/user-nominee-details.entity';

@Injectable({ scope: Scope.REQUEST }) // here
export class UserNomineeDetailsRepository extends Repository<UserNomineeDetails> {
  constructor(@Inject('CONNECTION') dataSource) {
    console.log('CONNECTIOONN');
    // console.log("REPOSITORY DATASOURCE", dataSource.createEntityManager());
    super(UserNomineeDetails, dataSource.createEntityManager());
  }
}
