import { Inject, Injectable, Scope } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { Pennydrops } from 'src/onboarding/bank/entities/pennydrops.entity';

@Injectable({ scope: Scope.REQUEST }) // here
export class PennydropsRepository extends Repository<Pennydrops> {
  constructor(@Inject('CONNECTION') dataSource) {
    console.log('CONNECTIOONN');
    // console.log("REPOSITORY DATASOURCE", dataSource.createEntityManager());
    super(Pennydrops, dataSource.createEntityManager());
  }
}
