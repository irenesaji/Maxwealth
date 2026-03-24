import { Inject, Injectable, Scope } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { SmartSipConfiguration } from 'src/smartsip_config/entities/smart_sip_configurations.entity';

@Injectable({ scope: Scope.REQUEST }) // here
export class SmartSipConfigurationRepository extends Repository<SmartSipConfiguration> {
  constructor(@Inject('CONNECTION') dataSource) {
    console.log('CONNECTIOONN');
    // console.log("REPOSITORY DATASOURCE", dataSource.createEntityManager());
    super(SmartSipConfiguration, dataSource.createEntityManager());
  }
}
