import { Inject, Injectable, Scope } from '@nestjs/common';
import { Bsev1EmandateBankCode } from 'src/utils/bsev1/entities/bsev1.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable({ scope: Scope.REQUEST }) // here
export class Bsev1EmandateBankCodeRepository extends Repository<Bsev1EmandateBankCode> {
  constructor(@Inject('CONNECTION') dataSource) {
    super(Bsev1EmandateBankCode, dataSource.createEntityManager());
  }
}
