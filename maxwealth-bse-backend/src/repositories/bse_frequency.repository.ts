import { Inject, Injectable, Scope } from '@nestjs/common';
import { BseFrequency } from 'src/utils/bse/entities/bse_frequency.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable({ scope: Scope.REQUEST }) // here
export class BseFrequencyRepository extends Repository<BseFrequency> {
  constructor(@Inject('CONNECTION') dataSource) {
    super(BseFrequency, dataSource.createEntityManager());
  }
}
