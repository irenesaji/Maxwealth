import {
  Controller,
  Get,
  Body,
  Query,
  Res,
  Headers,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { Response } from 'express';
import { MarkAsReadDto } from './dtos/mark_as_read.dto';

@Controller('api/notifications')
export class NotificationsController {
  constructor(private notificationService: NotificationsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/all')
  async activeSmartSips(
    @Res() res: Response,
    @Headers() headers,
    @Query('page') page,
    @Query('per_page') per_page,
  ) {
    const result = await this.notificationService.findAllByUserId(
      headers.user.id,
      page,
      per_page,
    );
    return res.status(result.status).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/mark_as_read')
  async mark_as_read(
    @Res() res: Response,
    @Headers() headers,
    @Body() markAsReadDto: MarkAsReadDto,
  ) {
    const result = await this.notificationService.markAsRead(
      headers.user.id,
      markAsReadDto,
    );
    return res.status(result.status).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/mark_all_as_read')
  async mark_all_as_read(@Res() res: Response, @Headers() headers) {
    const result = await this.notificationService.markAllAsRead(
      headers.user.id,
    );
    return res.status(result.status).json(result);
  }
}
