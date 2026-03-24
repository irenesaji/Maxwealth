import { Inject, Injectable, Scope } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { UserOnboardingDetails } from 'src/onboarding/entities/user_onboarding_details.entity';

@Injectable({ scope: Scope.REQUEST }) // here
export class UserOnboardingDetailsRepository extends Repository<UserOnboardingDetails> {
  constructor(@Inject('CONNECTION') dataSource) {
    console.log('CONNECTIOONN');
    // console.log("REPOSITORY DATASOURCE", dataSource.createEntityManager());
    super(UserOnboardingDetails, dataSource.createEntityManager());
  }
}
