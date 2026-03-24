import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Res,
  BadRequestException,
  Render,
  Req,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Response } from 'express';
import { html } from 'cheerio/dist/commonjs/static';
import { HTML5_FMT } from 'moment';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@Controller('/api/transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getTransactions(
    @Res() res: Response,
    @Query('folios') folios?: string,
    @Query('types') types?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    if (folios) {
      const folioNumbers = folios.split(',').map((folio) => folio.trim());
      const transactionTypes = types
        ? types.split(',').map((type) => type.trim())
        : undefined;
      const result = await this.transactionsService.findTransaction(
        page,
        limit,
        folioNumbers,
        transactionTypes,
        from,
        to,
      );
      return res.status(result.status).json(result);
    } else {
      const result = await this.transactionsService.findTransaction(
        page,
        limit,
      );
      return res.status(result.status).json(result);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('transaction_by_year')
  async getTransactionsByYear(
    @Query('year') year: number,
    @Res() res: Response,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const result = await this.transactionsService.findTransactionByYear(
      year,
      page,
      limit,
    );
    return res.status(result.status).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @Get('report')
  async getHoldingsReport(
    @Query('investment_account_id') investmentAccountId?: string,
    @Query('folios') folios?: string,
    @Query('as_on') asOn?: string,
    @Query('filter') filter?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    // if (!investmentAccountId && !folios) {
    //   throw new BadRequestException('Either investment_account_id or folios must be provided.');
    // }

    const folioList = folios ? folios.split(',') : [];
    return await this.transactionsService.generateHoldingsReport(
      filter,
      investmentAccountId,
      folioList,
      asOn,
      page,
      limit,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Patch('source')
  async sourceUpdate(
    @Query('folio_number') folios: string,
    @Res() res: Response,
  ) {
    const result = await this.transactionsService.updateSource(folios);
    return res.status(result.status).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('source_update')
  async sourceUpdateDirect(@Res() res: Response) {
    const result = await this.transactionsService.updateSourceDirect();
    return res.status(result.status).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @Get('schemewise')
  async schemewiseReports(
    @Query('user_id') investmentAccountId: string,
    @Query('as_On') asOndate: string,
    @Res() res: Response,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const result = await this.transactionsService.getSchemeReturns(
      investmentAccountId,
      asOndate,
      page,
      limit,
    );
    return res.status(result.status).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @Get('capitalgains')
  async capitalGainsReports(
    @Query('user_id') investmentAccountId: string,
    @Res() res: Response,
    @Query('folios') folios?: string,
    @Query('scheme') scheme?: string,
    @Query('traded_on_from') traded_on_from?: string,
    @Query('traded_on_to') traded_on_to?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const folioList = folios ? folios.split(',') : [];
    const result = await this.transactionsService.capital_gains(
      investmentAccountId,
      folioList,
      scheme,
      traded_on_from,
      traded_on_to,
      page,
      limit,
    );
    return res.status(result.status).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @Get('investment_account_wise_returns')
  async investment_account_wise_returns(
    @Query('user_id') investmentAccountId: string,
    @Res() res: Response,
    @Query('from') from?: string,
    @Query('traded_on_to') traded_on_to?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const result =
      await this.transactionsService.investment_account_wise_returns(
        investmentAccountId,
        from,
        traded_on_to,
        page,
        limit,
      );
    return res.status(result.status).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @Get('transaction_type_wise_returns')
  async transaction_type_wise_returns(
    @Res() res: Response,
    @Query('partner') partner?: string,
    @Query('traded_on_from') traded_on_from?: string,
    @Query('traded_on_to') traded_on_to?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const result = await this.transactionsService.transaction_type_wise_returns(
      partner,
      traded_on_from,
      traded_on_to,
      page,
      limit,
    );
    return res.status(result.status).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @Get('fund_scheme_category_wise')
  async fund_scheme_category_wise(
    @Res() res: Response,
    @Query('partner') partner?: string,
    @Query('traded_on_from') traded_on_from?: string,
    @Query('traded_on_to') traded_on_to?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const result = await this.transactionsService.fund_scheme_category_wise(
      partner,
      traded_on_from,
      traded_on_to,
      page,
      limit,
    );
    return res.status(result.status).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @Get('investor_details')
  async investor_details(
    @Res() res: Response,
    @Query('partner') partner?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const result = await this.transactionsService.getInvestorDetails(
      partner,
      page,
      limit,
    );
    return res.status(result.status).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @Get('getCurrentInvestedAmount')
  async getCurrentInvestedAmount(
    @Res() res: Response,
    @Query('user_id') user_id?: string,
    @Query('filter') filter?: string,
    @Query('folios') folios?: string[],
    @Query('ason') asOn?: string,
  ) {
    const result = await this.transactionsService.getCurrentInvestedAmount(
      user_id,
      filter,
      folios,
      asOn,
    );
    return res.status(result.status).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @Get('InvestedAmountByScheme')
  async getCurrentInvestedAmountbasedOnScheme(
    @Res() res: Response,
    @Query('user_id') user_id?: string,
    @Query('scheme') scheme?: string[],
    @Query('ason') asOn?: string,
  ) {
    const result =
      await this.transactionsService.getCurrentInvestedAmountbasedOnScheme(
        user_id,
        scheme,
        asOn,
      );
    return res.status(result.status).json(result);
  }

  @Render('test')
  @Get('postback/:tenant')
  async paymentPostback(
    @Req() request: Request,
    @Res() res: Response,
    @Query() query: string,
  ) {
    try {
      console.log('request', request.body);
      const html_string: string = query;

      return { html_string: html_string };
    } catch (error) {
      return { message: 'Something went wrong,' + error.message };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/transaction_summary')
  async getYearlyTransactionSummary(@Res() res: Response) {
    const result =
      await this.transactionsService.findYearlyTransactionsSummaryByType();
    return res.status(result.status).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @Get('get_investment_by_isin')
  async getInvestmentByIsin(
    @Headers() headers,
    @Query('isin') isin,
    @Query('folio') folio_number,
    @Res() res: Response,
  ) {
    console.log('Headersss', headers);
    console.log('Headersss user id', headers.user.id);
    const result = await this.transactionsService.getInvestmentByIsin(
      headers.user.id,
      isin,
      folio_number,
    );
    return res.status(result.status).json(result);
  }
}
