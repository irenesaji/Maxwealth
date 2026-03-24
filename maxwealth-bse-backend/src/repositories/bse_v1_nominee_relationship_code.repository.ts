import { Inject, Injectable, Scope } from '@nestjs/common';
import { Bsev1NomineeRelationshipCode } from 'src/utils/bsev1/entities/bsev1.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable({ scope: Scope.REQUEST }) // here
export class Bsev1NomineeRelationshipCodeRepository extends Repository<Bsev1NomineeRelationshipCode> {
  constructor(@Inject('CONNECTION') dataSource) {
    console.log('CONNECTIOONN');
    // console.log("REPOSITORY DATASOURCE", dataSource.createEntityManager());
    super(Bsev1NomineeRelationshipCode, dataSource.createEntityManager());
  }
}
