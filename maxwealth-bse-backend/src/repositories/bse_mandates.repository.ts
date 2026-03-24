import { Inject, Injectable, Scope } from '@nestjs/common';
import { BseFrequency } from 'src/utils/bse/entities/bse_frequency.entity';
import { BseMandates } from 'src/utils/bse/entities/bse_mandates.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable({ scope: Scope.REQUEST }) // here
export class BseMandatesRepository extends Repository<BseMandates> {
  constructor(@Inject('CONNECTION') dataSource) {
    super(BseMandates, dataSource.createEntityManager());
  }
}
