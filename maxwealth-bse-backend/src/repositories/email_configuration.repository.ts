import { Inject, Injectable, Scope } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
// import { SmsConfiguration } from 'src/users/entities/sms_configuration.entity';
import { EmailConfiguration } from 'src/users/entities/email_configuration.entity';

@Injectable({ scope: Scope.REQUEST }) // here
export class EmailConfigurationRepository extends Repository<EmailConfiguration> {
  constructor(@Inject('CONNECTION') dataSource) {
    console.log('CONNECTIOONN');
    // console.log("REPOSITORY DATASOURCE", dataSource.createEntityManager());
    super(EmailConfiguration, dataSource.createEntityManager());
  }
}
