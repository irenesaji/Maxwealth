import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

import { Response } from 'express';
import { OrderStatusService } from './order_status.service';
import { CrossRoleGuard } from 'src/auth/guard/cross-role.guard';

@Controller('api/order-status')
export class OrderStatusController {
  constructor(private readonly orderStatusService: OrderStatusService) {}

  @UseGuards(JwtAuthGuard)
  @UseGuards(CrossRoleGuard)
  @Get('/lumpsum')
  async allLumpsum(
    @Res() res: Response,
    @Query('user_id') user_id,
    @Query('type') type,
    @Query('page') page,
    @Query('limit') limit,
  ) {
    const result = await this.orderStatusService.all_lumpsum(
      user_id,
      type,
      page,
      limit,
    );
    return res.status(result.status).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(CrossRoleGuard)
  @Get('/completed_lumpsum')
  async completedLumpsum(@Res() res: Response, @Query('user_id') user_id) {
    const result = await this.orderStatusService.completed_lumpsum(user_id);
    return res.status(result.status).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(CrossRoleGuard)
  @Get('/inprogress_lumpsum')
  async inprogressLumpsum(@Res() res: Response, @Query('user_id') user_id) {
    const result = await this.orderStatusService.inprogress_lumpsum(user_id);
    return res.status(result.status).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(CrossRoleGuard)
  @Get('/failed_lumpsum')
  async failedLumpsum(@Res() res: Response, @Query('user_id') user_id) {
    const result = await this.orderStatusService.failed_lumpsum(user_id);
    return res.status(result.status).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(CrossRoleGuard)
  @Get('/sip')
  async allSip(
    @Res() res: Response,
    @Query('user_id') user_id,
    @Query('type') type,
    @Query('page') page,
    @Query('limit') limit,
  ) {
    const result = await this.orderStatusService.all_sip(
      user_id,
      type,
      page,
      limit,
    );
    return res.status(result.status).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(CrossRoleGuard)
  @Get('/active_sips')
  async activeSips(@Res() res: Response, @Query('user_id') user_id) {
    const result = await this.orderStatusService.active_sips(user_id);
    return res.status(result.status).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(CrossRoleGuard)
  @Get('/pending_sips')
  async pendingSips(@Res() res: Response, @Query('user_id') user_id) {
    const result = await this.orderStatusService.pending_sips(user_id);
    return res.status(result.status).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(CrossRoleGuard)
  @Get('/inactive_sips')
  async inactiveSips(@Res() res: Response, @Query('user_id') user_id) {
    const result = await this.orderStatusService.inactive_sips(user_id);
    return res.status(result.status).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(CrossRoleGuard)
  @Get('/switches')
  async all_switch(
    @Res() res: Response,
    @Query('user_id') user_id,
    @Query('type') type,
    @Query('page') page,
    @Query('limit') limit,
  ) {
    const result = await this.orderStatusService.all_switch(
      user_id,
      type,
      page,
      limit,
    );
    return res.status(result.status).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(CrossRoleGuard)
  @Get('/completed_switches')
  async completedSwitches(@Res() res: Response, @Query('user_id') user_id) {
    const result = await this.orderStatusService.completed_switches(user_id);
    return res.status(result.status).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(CrossRoleGuard)
  @Get('/inprogress_switches')
  async inprogressSwitches(@Res() res: Response, @Query('user_id') user_id) {
    const result = await this.orderStatusService.inprogress_switches(user_id);
    return res.status(result.status).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(CrossRoleGuard)
  @Get('/failed_switches')
  async failedSwitches(@Res() res: Response, @Query('user_id') user_id) {
    const result = await this.orderStatusService.failed_switches(user_id);
    return res.status(result.status).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(CrossRoleGuard)
  @Get('/redemption')
  async all_redemptions(
    @Res() res: Response,
    @Query('user_id') user_id,
    @Query('type') type,
    @Query('page') page,
    @Query('limit') limit,
  ) {
    const result = await this.orderStatusService.all_redemptions(
      user_id,
      type,
      page,
      limit,
    );
    return res.status(result.status).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(CrossRoleGuard)
  @Get('/completed_redemption')
  async completedRedemption(@Res() res: Response, @Query('user_id') user_id) {
    const result = await this.orderStatusService.completed_redemption(user_id);
    return res.status(result.status).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(CrossRoleGuard)
  @Get('/inprogress_redemption')
  async inprogressRedemption(@Res() res: Response, @Query('user_id') user_id) {
    const result = await this.orderStatusService.inprogress_redemption(user_id);
    return res.status(result.status).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(CrossRoleGuard)
  @Get('/failed_redemption')
  async failedRedemption(@Res() res: Response, @Query('user_id') user_id) {
    const result = await this.orderStatusService.failed_redemption(user_id);
    return res.status(result.status).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(CrossRoleGuard)
  @Get('/active_smart_sips')
  async activeSmartSips(@Res() res: Response, @Query('user_id') user_id) {
    const result = await this.orderStatusService.active_smart_sips(user_id);
    return res.status(result.status).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(CrossRoleGuard)
  @Get('/pending_smart_sips')
  async pendingSmartSips(@Res() res: Response, @Query('user_id') user_id) {
    const result = await this.orderStatusService.pending_smart_sips(user_id);
    return res.status(result.status).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(CrossRoleGuard)
  @Get('/inactive_smart_sips')
  async inactiveSmartSips(@Res() res: Response, @Query('user_id') user_id) {
    const result = await this.orderStatusService.inactive_smart_sips(user_id);
    return res.status(result.status).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(CrossRoleGuard)
  @Get('/active_no_mandate_sips')
  async activeNoMandateSips(@Res() res: Response, @Query('user_id') user_id) {
    const result = await this.orderStatusService.active_no_mandate_sips(
      user_id,
    );
    return res.status(result.status).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(CrossRoleGuard)
  @Get('/inactive_no_mandate_sips')
  async inactiveNoMandateSips(@Res() res: Response, @Query('user_id') user_id) {
    const result = await this.orderStatusService.inactive_no_mandate_sips(
      user_id,
    );
    return res.status(result.status).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(CrossRoleGuard)
  @Get('/swp')
  async allSwp(
    @Res() res: Response,
    @Query('user_id') user_id,
    @Query('type') type,
    @Query('page') page,
    @Query('limit') limit,
  ) {
    const result = await this.orderStatusService.all_swp(
      user_id,
      type,
      page,
      limit,
    );
    return res.status(result.status).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(CrossRoleGuard)
  @Get('/pending_swps')
  async pendingSwps(@Res() res: Response, @Query('user_id') user_id) {
    const result = await this.orderStatusService.pending_swps(user_id);
    return res.status(result.status).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(CrossRoleGuard)
  @Get('/active_swps')
  async activeSwps(@Res() res: Response, @Query('user_id') user_id) {
    const result = await this.orderStatusService.active_swps(user_id);
    return res.status(result.status).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(CrossRoleGuard)
  @Get('/inactive_swps')
  async inactiveSwps(@Res() res: Response, @Query('user_id') user_id) {
    const result = await this.orderStatusService.inactive_swps(user_id);
    return res.status(result.status).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(CrossRoleGuard)
  @Get('/pending_stps')
  async pendingStps(@Res() res: Response, @Query('user_id') user_id) {
    const result = await this.orderStatusService.pending_stps(user_id);
    return res.status(result.status).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(CrossRoleGuard)
  @Get('/stp')
  async allStp(
    @Res() res: Response,
    @Query('user_id') user_id,
    @Query('type') type,
    @Query('page') page,
    @Query('limit') limit,
  ) {
    const result = await this.orderStatusService.all_stp(
      user_id,
      type,
      page,
      limit,
    );
    return res.status(result.status).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(CrossRoleGuard)
  @Get('/active_stps')
  async activeStps(@Res() res: Response, @Query('user_id') user_id) {
    const result = await this.orderStatusService.active_stps(user_id);
    return res.status(result.status).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(CrossRoleGuard)
  @Get('/inactive_stps')
  async inactiveStps(@Res() res: Response, @Query('user_id') user_id) {
    const result = await this.orderStatusService.inactive_stps(user_id);
    return res.status(result.status).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/get_sip_details')
  async get_sip_details(@Res() res: Response, @Query('fp_sip_id') fp_sip_id) {
    const result = await this.orderStatusService.get_sip_details(fp_sip_id);
    return res.status(result.status).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/get_smart_sip_details')
  async get_smart_sip_details(
    @Res() res: Response,
    @Query('fp_sip_id') fp_sip_id,
  ) {
    const result = await this.orderStatusService.get_smart_sip_details(
      fp_sip_id,
    );
    return res.status(result.status).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/get_no_mandate_sip_details')
  async get_no_mandate_sip_details(@Res() res: Response, @Query('id') id) {
    const result = await this.orderStatusService.get_no_mandate_sip_details(id);
    return res.status(result.status).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/get_swp_details')
  async get_swp_details(@Res() res: Response, @Query('fp_swp_id') fp_swp_id) {
    const result = await this.orderStatusService.get_swp_details(fp_swp_id);
    return res.status(result.status).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/get_stp_details')
  async get_stp_details(@Res() res: Response, @Query('fp_stp_id') fp_stp_id) {
    const result = await this.orderStatusService.get_stp_details(fp_stp_id);
    return res.status(result.status).json(result);
  }
}
