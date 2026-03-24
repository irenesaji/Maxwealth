import { Inject, Injectable, Scope } from '@nestjs/common';
import { Bsev1UpiBankCode } from 'src/utils/bsev1/entities/bsev1.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable({ scope: Scope.REQUEST }) // here
export class Bsev1UpiBankCodeRepository extends Repository<Bsev1UpiBankCode> {
  constructor(@Inject('CONNECTION') dataSource) {
    super(Bsev1UpiBankCode, dataSource.createEntityManager());
  }
}
