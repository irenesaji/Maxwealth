import { Inject, Injectable, Scope } from '@nestjs/common';
import { BseSwpRegister } from 'src/transaction_baskets/entities/bsev1_swp_register.entity';
import { Repository } from 'typeorm';

@Injectable({ scope: Scope.REQUEST }) // here
export class BseSwpRegisterRepository extends Repository<BseSwpRegister> {
  constructor(@Inject('CONNECTION') dataSource) {
    super(BseSwpRegister, dataSource.createEntityManager());
  }
}
