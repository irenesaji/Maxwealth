import { Inject, Injectable, Scope } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { RzpCustomer } from 'src/utils/razorpay/entities/rzp_customers.entity';

@Injectable({ scope: Scope.REQUEST }) // here
export class RzpCustomerRepository extends Repository<RzpCustomer> {
  constructor(@Inject('CONNECTION') dataSource) {
    console.log('CONNECTIOONN');
    // console.log("REPOSITORY DATASOURCE", dataSource.createEntityManager());
    super(RzpCustomer, dataSource.createEntityManager());
  }
}
