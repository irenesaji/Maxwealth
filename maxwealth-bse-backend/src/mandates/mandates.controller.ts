import {
  Body,
  Controller,
  Headers,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  Render,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { MandatesService } from './mandates.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { Response, Request } from 'express';
import { AddMandateDto } from './dtos/add-mandate.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Mandates } from './entities/mandates.entity';
import { MandatePostbackDto } from './dtos/mandate-postback.dto';
@Controller('api/mandates')
export class MandatesController {
  constructor(private readonly mandateService: MandatesService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async get(
    @Res() res: Response,
    @Query('type') type,
    @Query('page') page,
    @Query('limit') limit,
    @Query('user_id') user_id,
    @Headers() headers,
    @Query('bank_id') bank_id?: number,
  ) {
    const result = await this.mandateService.getAll(
      headers.tenant_id,
      type,
      page,
      limit,
      user_id,
      bank_id,
    );
    return res.status(result.status).json(result);
  }

  // @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Res() res: Response,
    @Body() addMandateDto: AddMandateDto,
    @Headers() headers,
  ) {
    const result = await this.mandateService.create(
      addMandateDto,
      headers.tenant_id,
    );

    return res.status(result.status).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/authorize')
  async authorizeMandate(
    @Res() res: Response,
    @Body() body: { mandate_id: number },
    @Headers() headers,
  ) {
    const result = await this.mandateService.authorizeMandate(
      headers.tenant_id,
      body.mandate_id,
    );
    return res.status(result.status).json(result);
  }

  @Render('mandate_postback')
  @Get('/postback/:tenant_id')
  async postback(
    @Req() request: Request,
    @Res() res: Response,
    @Query() query: { mandate_id: number; Status: string },
  ) {
    try {
      console.log('postback request', request.body, query);
      const result = await this.mandateService.postback(query);
      return result;
    } catch (error) {
      return { message: 'Something went wrong,' + error.message };
    }
  }

  @Get('/postback/payment_page/:tenant_id')
  @Render('mandate_payment_page')
  async payment_page(
    @Res() res: Response,
    @Headers() headers,
    @Query('mandate_id') mandate_id,
    @Param('tenant_id') tenant_id,
  ) {
    const result = await this.mandateService.getPaymentPageResult(
      mandate_id,
      tenant_id,
    );
    return result;
  }
}
