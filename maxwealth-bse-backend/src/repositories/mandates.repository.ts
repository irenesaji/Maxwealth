import { Inject, Injectable, Scope } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Mandates } from 'src/mandates/entities/mandates.entity';

@Injectable({ scope: Scope.REQUEST }) // here
export class MandatesRepository extends Repository<Mandates> {
  constructor(@Inject('CONNECTION') dataSource) {
    console.log('CONNECTIOONN');
    // console.log("REPOSITORY DATASOURCE", dataSource.createEntityManager());
    super(Mandates, dataSource.createEntityManager());
  }
}
