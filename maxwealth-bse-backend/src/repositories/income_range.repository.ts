import { Inject, Injectable, Scope } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { IncomeRange } from 'src/onboarding/entities/income_ranges.entity';

@Injectable({ scope: Scope.REQUEST }) // here
export class IncomeRangeRepository extends Repository<IncomeRange> {
  constructor(@Inject('CONNECTION') dataSource) {
    console.log('CONNECTIOONN');
    // console.log("REPOSITORY DATASOURCE", dataSource.createEntityManager());
    super(IncomeRange, dataSource.createEntityManager());
  }
}
