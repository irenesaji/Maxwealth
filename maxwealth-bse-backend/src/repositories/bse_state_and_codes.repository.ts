import { Inject, Injectable, Scope } from '@nestjs/common';
import { BseStateandCode } from 'src/utils/bse/entity/bse.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable({ scope: Scope.REQUEST }) // here
export class BseStateandCodeRepository extends Repository<BseStateandCode> {
  constructor(@Inject('CONNECTION') dataSource) {
    super(BseStateandCode, dataSource.createEntityManager());
  }
}
