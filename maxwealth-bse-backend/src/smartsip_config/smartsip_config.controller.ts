import {
  Body,
  Controller,
  Post,
  Get,
  Res,
  UseGuards,
  Headers,
  Query,
} from '@nestjs/common';
import { SmartsipConfigService } from './smartsip_config.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { Response } from 'express';
import { SmartSipFundSplitDto } from './dtos/smart_sip_fund_split.dto';

@Controller('api/smartsip-config')
export class SmartsipConfigController {
  constructor(private readonly smartsipConfigService: SmartsipConfigService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/get_all_smartsip_funds')
  async get_all_sip_funds(@Res() res: Response, @Headers() headers) {
    const result = await this.smartsipConfigService.get_all_smartsip_funds();
    return res.status(result.status).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/split_fund')
  async split_fund(
    @Res() res: Response,
    @Headers() headers,
    @Body() smartSipFundSplitDto: SmartSipFundSplitDto,
  ) {
    const result = await this.smartsipConfigService.split_fund(
      smartSipFundSplitDto,
    );
    return res.status(result.status).json(result);
  }
}
