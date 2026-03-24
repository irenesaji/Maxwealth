import { Inject, Injectable, Scope } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { SmsConfiguration } from 'src/users/entities/sms_configuration.entity';

@Injectable({ scope: Scope.REQUEST }) // here
export class SmsConfigurationRepository extends Repository<SmsConfiguration> {
  constructor(@Inject('CONNECTION') dataSource) {
    console.log('CONNECTIOONN');
    // console.log("REPOSITORY DATASOURCE", dataSource.createEntityManager());
    super(SmsConfiguration, dataSource.createEntityManager());
  }
}
