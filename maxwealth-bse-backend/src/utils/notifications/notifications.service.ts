import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notifications } from './entities/notification.entity';
import { Repository } from 'typeorm';
import { MarkAsReadDto } from './dtos/mark_as_read.dto';
import { NotificationsRepository } from 'src/repositories/notifications.repository';

@Injectable()
export class NotificationsService {
  constructor(
    // @InjectRepository(Notifications)
    // private notificationRepository : Repository<Notifications>

    private notificationRepository: NotificationsRepository,
  ) {}

  sendOtp() {
    try {
      return true;
    } catch (e) {
      return false;
    }
  }

  async findAllByUserId(user_id: number, page: number, per_page) {
    try {
      const skip = per_page * page - per_page;
      const notifications = await this.notificationRepository.find({
        where: { user_id: user_id },
        take: per_page,
        skip: skip,
      });
      return { status: HttpStatus.OK, data: notifications };
    } catch (ex) {
      return { status: HttpStatus.BAD_REQUEST, error: ex.message };
    }
  }

  async markAsRead(user_id: number, mark_as_read: MarkAsReadDto) {
    try {
      const notifications = await this.notificationRepository.update(
        { user_id: user_id, id: mark_as_read.notification_id },
        { is_read: true },
      );
      return { status: HttpStatus.OK, data: notifications };
    } catch (ex) {
      return { status: HttpStatus.BAD_REQUEST, error: ex.message };
    }
  }

  async markAllAsRead(user_id: number) {
    try {
      const notifications = await this.notificationRepository.update(
        { user_id: user_id },
        { is_read: true },
      );
      return { status: HttpStatus.OK, data: notifications };
    } catch (ex) {
      return { status: HttpStatus.BAD_REQUEST, error: ex.message };
    }
  }
}
