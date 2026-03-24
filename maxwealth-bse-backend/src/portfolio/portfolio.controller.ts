import {
  Controller,
  Get,
  Res,
  UseGuards,
  Headers,
  Query,
  HttpStatus,
  Param,
  StreamableFile,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
} from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { Response } from 'express';
import { createReadStream } from 'fs';
import { join } from 'path';
import { CrossRoleGuard } from 'src/auth/guard/cross-role.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'multer.config';
import { diskStorage } from 'multer';
import { editFileName } from 'file_feature';

@Controller('api/portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/get_risk_based_funds')
  async get_risk_based_funds(
    @Res() res: Response,
    @Headers() headers,
    @Query('page') page: number,
  ) {
    const result = await this.portfolioService.get_risk_based_funds(
      headers.user.id,
      page ? page : 1,
    );
    return res.status(result.status).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/dashboard')
  async get_dashboard(@Res() res: Response, @Headers() headers) {
    const result = await this.portfolioService.get_dashboard(headers.user.id);
    return res.status(result.status).json(result);
  }

  // @UseGuards(JwtAuthGuard)
  @Get('/holdings')
  async get_holdings(
    @Res() res: Response,
    @Headers() headers,
    @Query('user_id') user_id,
    @Query('filter') filter,
    @Query('tradedOnTo') tradedOnTo?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const result = await this.portfolioService.get_holdings(
      user_id,
      filter,
      tradedOnTo,
      page,
      limit,
    );
    return res.status(result.status).json(result);
  }

  // @UseGuards(JwtAuthGuard)
  @Get('v2/holdings')
  async get_holdings_version_2(
    @Res() res: Response,
    @Headers() headers,
    @Query('user_id') user_id,
    @Query('filter') filter,
    @Query('tradedOnTo') tradedOnTo?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const result = await this.portfolioService.get_holdings_version_2(
      user_id,
      filter,
      tradedOnTo,
      page,
      limit,
    );
    return res.status(result.status).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/get_specific_holdings')
  async get_specific_holdings(
    @Res() res: Response,
    @Headers() headers,
    @Query('folio') folio,
    @Query('isin') isin,
  ) {
    const result = await this.portfolioService.get_specific_fund_holding(
      headers.user.id,
      folio,
      isin,
    );
    return res.status(result.status).json(result);
  }

  @UseGuards(JwtAuthGuard)
  // @UseGuards(CrossRoleGuard)
  @Get('/portfolio_analysis')
  async portfolio_analysis(
    @Res() res: Response,
    @Headers() headers,
    @Query('user_id') user_id,
    @Query('tradedOnTo') tradedOnTo?: string,
  ) {
    const result = await this.portfolioService.portfolio_analysis(
      headers.user.id,
      tradedOnTo,
    );
    return res.status(result.status).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/smart_portfolio_analysis')
  async smart_portfolio_analysis(
    @Res() res: Response,
    @Headers() headers,
    @Query('transaction_basket_id') transaction_basket_id,
  ) {
    const result = await this.portfolioService.smart_portfolio_analysis(
      headers.user.id,
      transaction_basket_id,
    );
    return res.status(result.status).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/benchmark_nav_graph')
  async benchmark_nav_graph(
    @Res() res: Response,
    @Headers() headers,
    @Query('duration') duration,
  ) {
    if (duration) {
      const result = await this.portfolioService.get_benchmark_nav(duration);
      return res.status(result.status).json(result);
    } else {
      return res.status(HttpStatus.BAD_REQUEST).json({
        status: HttpStatus.BAD_REQUEST,
        error: 'Please provide duration',
      });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/returns_graph')
  async returns_graph(
    @Res() res: Response,
    @Headers() headers,
    @Query('duration') duration,
    @Query('user_id') user_id,
  ) {
    if (duration) {
      console.log('Headers', headers);
      const result = await this.portfolioService.get_returns_graph(
        headers.user.id,
        duration,
      );
      return res.status(result.status).json(result);
    } else {
      return res.status(HttpStatus.BAD_REQUEST).json({
        status: HttpStatus.BAD_REQUEST,
        error: 'Please provide duration',
      });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/smart_returns_graph')
  async smart_returns_graph(
    @Res() res: Response,
    @Headers() headers,
    @Query('duration') duration,
    @Query('transaction_basket_id') transaction_basket_id,
  ) {
    if (duration) {
      const result = await this.portfolioService.get_smart_returns_graph(
        headers.user.id,
        duration,
        transaction_basket_id,
      );
      return res.status(result.status).json(result);
    } else {
      return res.status(HttpStatus.BAD_REQUEST).json({
        status: HttpStatus.BAD_REQUEST,
        error: 'Please provide duration',
      });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/capital_gain_report')
  async capital_gain_report(
    @Res() res: Response,
    @Headers() headers,
    @Query('page') page,
  ) {
    let result = { status: HttpStatus.BAD_REQUEST };
    if (page) {
      result = await this.portfolioService.get_capital_gain_reports(
        headers.user.id,
        page,
      );
    } else {
      result = await this.portfolioService.get_capital_gain_reports(
        headers.user.id,
        1,
      );
    }
    return res.status(result.status).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/capital_gain_report_yearly')
  async capital_gain_report_yearly(
    @Res() res: Response,
    @Headers() headers,
    @Query('page') page,
  ) {
    let result = { status: HttpStatus.BAD_REQUEST };
    if (page) {
      result = await this.portfolioService.get_capital_gain_reports_yearly(
        headers.user.id,
        page,
      );
    } else {
      result = await this.portfolioService.get_capital_gain_reports_yearly(
        headers.user.id,
        1,
      );
    }
    return res.status(result.status).json(result);
  }

  @Get('/capital_gain_report_download/:user_id/:file_name')
  getFile(
    @Param('file_name') file_name,
    @Param('user_id') user_id,
  ): StreamableFile {
    const file = createReadStream(
      join(process.cwd(), 'uploads/reports/' + user_id + '/' + file_name),
    );
    return new StreamableFile(file);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/list_smart_sips')
  async list_smart_sips(@Res() res: Response, @Headers() headers) {
    let result = { status: HttpStatus.BAD_REQUEST };

    result = await this.portfolioService.list_smart_sips(headers.user.id);

    return res.status(result.status).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/distributor_logo')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/distributor_logo',
        filename: editFileName,
      }),
    }),
  )
  async distributor_logo(
    @Res() res: Response,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { tenant_id: string },
  ) {
    // let result = { status: HttpStatus.BAD_REQUEST };

    const result = await this.portfolioService.distributor_logo(
      file,
      body.tenant_id,
    );

    return res.status(result.status).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/get_distributor_logo')
  async get_distributor_logo(
    @Res() res: Response,
    @Headers() headers,
    @Query('tenant_id') tenant_id,
  ) {
    const result = await this.portfolioService.get_distributor_logo(tenant_id);
    return res.status(result.status).json(result);
  }
}
