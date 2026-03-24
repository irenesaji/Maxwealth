import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notifications } from './entities/notification.entity';
import { NotificationsRepository } from 'src/repositories/notifications.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Notifications])],
  providers: [NotificationsService, NotificationsRepository],
  exports: [NotificationsService],
  controllers: [NotificationsController],
})
export class NotificationsModule {}
