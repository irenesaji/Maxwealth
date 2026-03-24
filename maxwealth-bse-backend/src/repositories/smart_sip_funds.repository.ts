import { Inject, Injectable, Scope } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { SmartSipFunds } from 'src/smartsip_config/entities/smart_sip_funds.entity';

@Injectable({ scope: Scope.REQUEST }) // here
export class SmartSipFundsRepository extends Repository<SmartSipFunds> {
  constructor(@Inject('CONNECTION') dataSource) {
    console.log('CONNECTIOONN');
    // console.log("REPOSITORY DATASOURCE", dataSource.createEntityManager());
    super(SmartSipFunds, dataSource.createEntityManager());
  }
}
