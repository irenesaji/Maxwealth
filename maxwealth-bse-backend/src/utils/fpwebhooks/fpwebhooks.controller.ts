import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { FpwebhooksService } from './fpwebhooks.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { Response } from 'express';

@Controller('api/fpwebhooks')
export class FpwebhooksController {
  constructor(private readonly fpwebhooksService: FpwebhooksService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/subscribe_to_webhooks')
  async subscribe_to_webhooks(@Res() res: Response) {
    const result = await this.fpwebhooksService.subscribe_to_webhooks();
    return res.status(result.status).json(result);
  }

  @Post('/postback/:tenant_id')
  async notification(@Res() res: Response, @Body() body: any) {
    console.log('WEBHOOK BODY', body);

    const result = await this.fpwebhooksService.notification(body);
  }

  // @Get('/test')
  // async test(@Res() res: Response) {
  //   console.log("whatsapp start test");
  //   let result = await this.fpwebhooksService.test();

  // }
}
