import {
  Body,
  Headers,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ModelPortfolioService } from './model_portfolio.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { Response } from 'express';
import { ChangeFundBasketInputDto } from './dtos/changeFundBasketInput.dto';

@Controller('api/model-portfolio')
export class ModelPortfolioController {
  constructor(private readonly modelPortfolioService: ModelPortfolioService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/fund_distribute')
  async fund_distribute(
    @Res() res: Response,
    @Query('model_portfolio_id') model_portfolio_id,
    @Query('amount') amount,
    @Query('duration') duration,
    @Query('is_onetime') is_onetime = 'false',
    @Headers() headers,
  ) {
    console.log(model_portfolio_id);
    const boolValue = is_onetime == 'true';
    const result = await this.modelPortfolioService.fundDistribute(
      amount,
      model_portfolio_id,
      headers.user.id,
      duration,
      boolValue,
    );
    return res.status(result.status).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/change_fund')
  async change_fund(
    @Res() res: Response,
    @Body() changeFundBasketInputDto: ChangeFundBasketInputDto,
    @Headers() headers,
  ) {
    const result = await this.modelPortfolioService.changeFund(
      changeFundBasketInputDto,
    );
    return res.status(result.status).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/invest_500')
  async get_invest_500(@Res() res: Response) {
    const result = await this.modelPortfolioService.get_invest_500();
    return res.status(result.status).json(result);
  }
}
