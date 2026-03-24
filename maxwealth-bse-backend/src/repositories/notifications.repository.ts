import { Inject, Injectable, Scope } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Notifications } from 'src/utils/notifications/entities/notification.entity';

@Injectable({ scope: Scope.REQUEST }) // here
export class NotificationsRepository extends Repository<Notifications> {
  constructor(@Inject('CONNECTION') dataSource) {
    console.log('CONNECTIOONN');
    // console.log("REPOSITORY DATASOURCE", dataSource.createEntityManager());
    super(Notifications, dataSource.createEntityManager());
  }
}
