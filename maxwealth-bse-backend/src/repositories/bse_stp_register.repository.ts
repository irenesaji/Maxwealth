import { Inject, Injectable, Scope } from '@nestjs/common';
import { BseStpRegister } from 'src/transaction_baskets/entities/bsev1_stp_register.entity';
import { Repository } from 'typeorm';

@Injectable({ scope: Scope.REQUEST }) // here
export class BseStpRegisterRepository extends Repository<BseStpRegister> {
  constructor(@Inject('CONNECTION') dataSource) {
    super(BseStpRegister, dataSource.createEntityManager());
  }
}
