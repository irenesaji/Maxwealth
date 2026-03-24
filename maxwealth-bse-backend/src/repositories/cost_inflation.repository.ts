import { Inject, Injectable, Scope } from '@nestjs/common';
import { CostInflationIndex } from 'src/cii/entities/cii.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable({ scope: Scope.REQUEST }) // here
export class CostInflationIndexRepository extends Repository<CostInflationIndex> {
  constructor(@Inject('CONNECTION') dataSource) {
    super(CostInflationIndex, dataSource.createEntityManager());
  }
}
