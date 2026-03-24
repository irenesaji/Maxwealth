import {
  Controller,
  Get,
  Res,
  UseGuards,
  Headers,
  Post,
  Body,
  Query,
} from '@nestjs/common';
import { AdminReportsService } from './admin_reports.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { Response } from 'express';
import { GetAumReportDto } from 'src/utils/fintech/dtos/get_aum_report.dto';
import { TransactionListDto } from 'src/utils/fintech/dtos/transaction_list.dto';
import { ListFilterDto } from 'src/utils/fintech/dtos/list_filter.dto';
import { CapitalGainFilterDto } from 'src/utils/fintech/dtos/capital_gain_filter.dto';
import { ReturnsFilterDto } from 'src/utils/fintech/dtos/returns_filter.dto';
import { Roles } from 'src/auth/roles.decorator';
import Role from 'src/auth/enums/roles.enum';
@Controller('api/admin/reports')
export class AdminReportsController {
  constructor(private readonly adminReportsService: AdminReportsService) {}

  @UseGuards(JwtAuthGuard)
  @Roles(Role.Admin)
  @Get('/get_folios')
  async get_folios(
    @Res() res: Response,
    @Headers() headers,
    @Query('user_id') user_id,
  ) {
    const result = await this.adminReportsService.get_folios(user_id);
    return res.status(result.status).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.Admin)
  @Get('/get_purchase_plans')
  async get_purchase_plans(@Res() res: Response, @Headers() headers) {
    const result = await this.adminReportsService.get_purchase_plans();
    return res.status(result.status).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.Admin)
  @Get('/get_purchases')
  async get_purchases(@Res() res: Response, @Headers() headers) {
    const result = await this.adminReportsService.get_purchases();
    return res.status(result.status).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.Admin)
  @Get('/get_switch_plans')
  async get_switch_plans(@Res() res: Response, @Headers() headers) {
    const result = await this.adminReportsService.get_switch_plans();
    return res.status(result.status).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.Admin)
  @Get('/get_redemption_plans')
  async get_redemption_plans(@Res() res: Response, @Headers() headers) {
    const result = await this.adminReportsService.get_redemption_plans();
    return res.status(result.status).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.Admin)
  @Get('/get_aum_report')
  async get_aum_report_overall(
    @Res() res: Response,
    @Headers() headers,
    @Query('traded_on_from') traded_on_from,
    @Query('traded_on_to') traded_on_to,
  ) {
    const result = await this.adminReportsService.get_aum_report_overall(
      traded_on_from,
      traded_on_to,
    );
    return res.status(result.status).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.Admin)
  @Post('/get_aum_report')
  async get_aum_report(
    @Res() res: Response,
    @Headers() headers,
    @Body() getAumReportDto?: GetAumReportDto,
  ) {
    const result = await this.adminReportsService.get_aum_report(
      getAumReportDto.partner,
      getAumReportDto.traded_on_from,
      getAumReportDto.traded_on_to,
    );
    return res.status(result.status).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.Admin)
  @Get('/get_transaction_type_wise_amount_summary')
  async get_transaction_type_wise_amount_summary_overall(
    @Res() res: Response,
    @Headers() headers,
    @Query('traded_on_from') traded_on_from,
    @Query('traded_on_to') traded_on_to,
  ) {
    const result =
      await this.adminReportsService.get_transaction_type_wise_amount_summary_overall(
        traded_on_from,
        traded_on_to,
      );
    return res.status(result.status).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.Admin)
  @Post('/get_transaction_type_wise_amount_summary')
  async get_transaction_type_wise_amount_summary(
    @Res() res: Response,
    @Headers() headers,
    @Body() getAumReportDto?: GetAumReportDto,
  ) {
    const result =
      await this.adminReportsService.get_transaction_type_wise_amount_summary(
        getAumReportDto.partner,
        getAumReportDto.traded_on_from,
        getAumReportDto.traded_on_to,
      );
    console.log('Result', result);
    return res.status(result.status).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.Admin)
  @Post('/transaction_list')
  async transaction_list(
    @Body() transactionListDto: TransactionListDto,
    @Res() res: Response,
    @Headers() headers,
  ) {
    const result = await this.adminReportsService.get_transaction_list(
      transactionListDto,
    );
    return res.status(result.status).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.Admin)
  @Post('/mf_purchase_list')
  async mf_purchase_list(
    @Body() listFilterDto: ListFilterDto,
    @Res() res: Response,
    @Headers() headers,
  ) {
    const result = await this.adminReportsService.get_mf_purchase_list(
      listFilterDto,
    );
    return res.status(result.status).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.Admin)
  @Post('/mf_redemption_list')
  async mf_redemption_list(
    @Body() listFilterDto: ListFilterDto,
    @Res() res: Response,
    @Headers() headers,
  ) {
    const result = await this.adminReportsService.get_mf_redemption_list(
      listFilterDto,
    );
    return res.status(result.status).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.Admin)
  @Get('/transactions')
  async get_transactions(
    @Res() res: Response,
    @Headers() headers,
    @Query('types') types,
    @Query('folios') folios,
    @Query('from') from,
    @Query('to') to,
  ) {
    const result = await this.adminReportsService.get_transactions_report(
      folios,
      types,
      from,
      to,
    );
    return res.status(result.status).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.Admin)
  @Get('/holdings')
  async get_holdings_report(
    @Res() res: Response,
    @Headers() headers,
    @Query('investment_account_id') investment_account_id,
    @Query('folios') folios,
    @Query('as_on') as_on,
  ) {
    const folioList = folios ? folios.split(',') : [];
    const result = await this.adminReportsService.get_holdings_report(
      investment_account_id,
      folioList,
      as_on,
    );
    return res.status(result.status).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.Admin)
  @Post('/get_capital_gain')
  async get_capital_gain(
    @Body() capitalGainFilterDto: CapitalGainFilterDto,
    @Res() res: Response,
    @Headers() headers,
  ) {
    const result = await this.adminReportsService.get_capital_gains_report(
      capitalGainFilterDto.mf_investment_account,
      capitalGainFilterDto.folios,
      capitalGainFilterDto.scheme,
      capitalGainFilterDto.traded_on_from,
      capitalGainFilterDto.traded_on_to,
    );
    return res.status(result.status).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.Admin)
  @Post('/scheme_wise_returns')
  async get_scheme_wise_returns(
    @Body() returnsFilterDto: ReturnsFilterDto,
    @Res() res: Response,
    @Headers() headers,
  ) {
    const result = await this.adminReportsService.get_scheme_wise_returns(
      returnsFilterDto.mf_investment_account,
      returnsFilterDto.traded_on_to,
    );
    return res.status(result.status).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.Admin)
  @Post('/investment_account_wise_returns')
  async get_investment_account_wise_returns(
    @Body() returnsFilterDto: ReturnsFilterDto,
    @Res() res: Response,
    @Headers() headers,
  ) {
    const result =
      await this.adminReportsService.investment_account_wise_returns(
        returnsFilterDto.mf_investment_account,
        returnsFilterDto.traded_on_to,
      );
    return res.status(result.status).json(result);
  }
}
