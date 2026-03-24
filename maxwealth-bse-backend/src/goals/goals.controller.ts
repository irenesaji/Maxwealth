import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { GoalsService } from './goals.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { Response } from 'express';
import { EmergencyFundInputsDto } from './dtos/emergency_fund_inputs.dto';
import { FirstCroreInputsDto } from './dtos/first_crore_inputs.dto';
import { TaxSaverInputsDto } from './dtos/tax_saver_inputs.dto';
import { LongTermInputsDto } from './dtos/long_term_inputs.dto';
import { RetirementCorpusInputsDto } from './dtos/retirement_corpus_inputs.dto';
import { ParkedMoneyInputsDto } from './dtos/parked_money_inputs.dto';

@Controller('api/goals')
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/get_future_value')
  async getFutureValue(
    @Res() res: Response,
    @Query('current_value') current_value,
    @Query('years') years,
    @Query('inflation_rate') inflation_rate,
  ) {
    const result = await this.goalsService.get_future_value(
      current_value,
      years,
      inflation_rate,
    );
    return res.status(result.status).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/get_fund_detail_return')
  async getFundDetailReturn(
    @Res() res: Response,
    @Query('plan_id') plan_id,
    @Query('amount') amount,
    @Query('calculation_type') calculation_type,
  ) {
    const result = await this.goalsService.calculate_fund_returns(
      plan_id,
      amount,
      calculation_type,
    );
    return res.status(result.status).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/calculate_emergency_fund')
  async calculate_emergency_fund(
    @Res() res: Response,
    @Body() emergencyFundInputsDto: EmergencyFundInputsDto,
  ) {
    const result = await this.goalsService.calculate_emergency_fund(
      emergencyFundInputsDto,
    );
    return res.status(result.status).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/calculate_my_first_crore')
  async calculate_my_first_crore(
    @Res() res: Response,
    @Body() firstCroreInputsDto: FirstCroreInputsDto,
  ) {
    const result = await this.goalsService.calculate_my_first_crore(
      firstCroreInputsDto,
    );
    return res.status(result.status).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/calculate_tax_saver')
  async calculate_tax_saver(
    @Res() res: Response,
    @Body() taxSaverInputsDto: TaxSaverInputsDto,
  ) {
    const result = await this.goalsService.calculate_tax_saver(
      taxSaverInputsDto,
    );
    return res.status(result.status).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/calculate_long_term')
  async long_term(
    @Res() res: Response,
    @Body() longTermInputsDto: LongTermInputsDto,
  ) {
    const result = await this.goalsService.calculate_long_term(
      longTermInputsDto,
    );
    return res.status(result.status).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/calculate_parked_money')
  async parked_money(
    @Res() res: Response,
    @Body() parkedMoneyInputsDto: ParkedMoneyInputsDto,
  ) {
    const result = await this.goalsService.calculate_parked_money(
      parkedMoneyInputsDto,
    );
    return res.status(result.status).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/calculate_retirement')
  async calculate_retirement(
    @Res() res: Response,
    @Body() retirementCorpusInputsDto: RetirementCorpusInputsDto,
  ) {
    const result = await this.goalsService.calculate_retirement(
      retirementCorpusInputsDto,
    );
    return res.status(result.status).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllGoal(@Res() res: Response) {
    const result = await this.goalsService.get_all_goals();
    return res.status(result.status).json(result);
  }
}
