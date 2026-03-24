import { Inject, Injectable, Scope } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { SignzyKycObject } from 'src/onboarding/entities/signzy_kyc_object.entity';

@Injectable({ scope: Scope.REQUEST }) // here
export class SignzyKycObjectRepository extends Repository<SignzyKycObject> {
  constructor(@Inject('CONNECTION') dataSource) {
    console.log('CONNECTIOONN');
    // console.log("REPOSITORY DATASOURCE", dataSource.createEntityManager());
    super(SignzyKycObject, dataSource.createEntityManager());
  }
}
