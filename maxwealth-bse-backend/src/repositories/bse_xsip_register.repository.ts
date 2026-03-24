import { Inject, Injectable, Scope } from '@nestjs/common';
import { BseXSipRegister } from 'src/transaction_baskets/entities/bsev1_xsip_register.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable({ scope: Scope.REQUEST }) // here
export class BseXSipRegisterRepository extends Repository<BseXSipRegister> {
  constructor(@Inject('CONNECTION') dataSource) {
    super(BseXSipRegister, dataSource.createEntityManager());
  }
}
