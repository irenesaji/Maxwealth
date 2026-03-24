import {
  Body,
  Controller,
  Get,
  Post,
  Res,
  Headers,
  UseGuards,
} from '@nestjs/common';
import { RiskProfilesService } from './risk_profiles.service';
import { Response } from 'express';
import { UserAnswerDto } from './dto/user_answer.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@Controller('api/risk_profiles')
export class RiskProfilesController {
  constructor(private readonly riskProfilesService: RiskProfilesService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/get_quiz')
  async create(@Res() res: Response) {
    const result = await this.riskProfilesService.get_quiz();
    return res.status(result.status).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/record_user_answer')
  async record_user_answer(
    @Body() userAnswerDto: UserAnswerDto,
    @Res() res: Response,
  ) {
    const result = await this.riskProfilesService.record_user_answer(
      userAnswerDto,
    );
    return res.status(result.status).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/get_user_risk_profile')
  async get_user_risk_profile(@Res() res: Response, @Headers() header) {
    const result = await this.riskProfilesService.user_risk_profile(
      header.user.id,
    );
    return res.status(result.status).json(result);
  }
}
