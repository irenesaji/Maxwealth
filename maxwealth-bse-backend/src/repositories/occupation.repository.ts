import { Inject, Injectable, Scope } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Occupation } from 'src/onboarding/entities/occupations.entity';

@Injectable({ scope: Scope.REQUEST }) // here
export class OccupationRepository extends Repository<Occupation> {
  constructor(@Inject('CONNECTION') dataSource) {
    console.log('CONNECTIOONN');
    // console.log("REPOSITORY DATASOURCE", dataSource.createEntityManager());
    super(Occupation, dataSource.createEntityManager());
  }
}
