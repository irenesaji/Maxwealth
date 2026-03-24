import { Inject, Injectable, Scope } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { RzpTransfer } from 'src/utils/razorpay/entities/rzp_transfer.entity';

@Injectable({ scope: Scope.REQUEST }) // here
export class RzpTransfersRepository extends Repository<RzpTransfer> {
  constructor(@Inject('CONNECTION') dataSource) {
    console.log('CONNECTIOONN');
    // console.log("REPOSITORY DATASOURCE", dataSource.createEntityManager());
    super(RzpTransfer, dataSource.createEntityManager());
  }
}
