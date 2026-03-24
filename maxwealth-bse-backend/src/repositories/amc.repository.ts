import { Inject, Injectable, Scope } from '@nestjs/common';
import { Amc } from 'src/amcs/entities/amc.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable({ scope: Scope.REQUEST }) // here
export class AmcRepository extends Repository<Amc> {
  constructor(@Inject('CONNECTION') dataSource) {
    super(Amc, dataSource.createEntityManager());
  }
}
