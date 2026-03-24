import { Inject, Injectable, Scope } from '@nestjs/common';
import { Source } from 'src/investor-details/entities/sources.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable({ scope: Scope.REQUEST }) // here
export class SourceRepository extends Repository<Source> {
  constructor(@Inject('CONNECTION') dataSource) {
    console.log('CONNECTIOONN');
    // console.log("REPOSITORY DATASOURCE", dataSource.createEntityManager());
    super(Source, dataSource.createEntityManager());
  }
}
