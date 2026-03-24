import { Inject, Injectable, Scope } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Proofs } from 'src/onboarding/proofs/entities/proofs.entity';

@Injectable({ scope: Scope.REQUEST }) // here
export class ProofsRepository extends Repository<Proofs> {
  constructor(@Inject('CONNECTION') dataSource) {
    console.log('CONNECTIOONN');
    // console.log("REPOSITORY DATASOURCE", dataSource.createEntityManager());
    super(Proofs, dataSource.createEntityManager());
  }
}
