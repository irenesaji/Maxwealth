import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
  Headers,
  Render,
  Query,
  HttpStatus,
  Header,
} from '@nestjs/common';
import { TransactionBasketsService } from './transaction_baskets.service';
import { Response, Request } from 'express';
import { CreateTransactionBasketDTO } from './dtos/create_transaction_baskets.dto';
import { ValidateConsentBodyDto } from './dtos/validate_consent_body.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { PaymentTransactionBasketDTO } from './dtos/payment_transaction_basket.dto';

@Controller('api/transaction-baskets')
export class TransactionBasketsController {
  constructor(private readonly transactionService: TransactionBasketsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/fund')
  async getFpFundDetails(@Res() res: Response, @Query('isin') isin) {
    const result = await this.transactionService.getFpFund(isin);
    return res.status(result.status).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/fpfundForSmartsip/')
  async getFpFundForSmartsipDetails(@Res() res: Response, @Query('isin') isin) {
    const result = await this.transactionService.getFpFundForSmartsip(isin);
    return res.status(result.status).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createBasketOrder(
    @Body() createTransactionBasketDTO: CreateTransactionBasketDTO,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const result = await this.transactionService.createBasketOrder(
      createTransactionBasketDTO,
      req.ip,
      req.socket.localAddress,
    );
    return res.status(result.status).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/generate-consent')
  async generateBasketConsent(
    @Query('transaction_basket_id') transaction_basket_id,
    @Query('type') type: string,
    @Res() res: Response,
    @Req() req: Request,
    @Headers() headers,
  ) {
    const result = await this.transactionService.generateBasketConsent(
      headers.tenant_id,
      transaction_basket_id,
      type,
      headers.user,
    );
    return res.status(result.status).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/validate-basket-consent')
  async validateBasketConsent(
    @Headers() header,
    @Res() res: Response,
    @Req() req: Request,
    @Body() otpConsentBodyDto: ValidateConsentBodyDto,
  ) {
    console.log('otpConsentBodyDto', otpConsentBodyDto);
    const result = await this.transactionService.validateBasketConsent(
      otpConsentBodyDto.transaction_basket_id,
      otpConsentBodyDto.otp,
      req.ip,
      req.socket.localAddress,
      header.tenant_id,
    );
    return res.status(result.status).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/initiate-basket-payment')
  async initiateBasketPayments(
    @Body() paymentTransactionBasketDTO: PaymentTransactionBasketDTO,
    @Res() res: Response,
    @Req() req: Request,
    @Headers() headers,
  ) {
    const result = await this.transactionService.initiateBasketPayments(
      paymentTransactionBasketDTO.transaction_basket_id,
      paymentTransactionBasketDTO.method,
      paymentTransactionBasketDTO.bank_id,
      headers.tenant_id,
      paymentTransactionBasketDTO.vpa_id,
    );
    return res.status(result.status).json(result);
  }

  @Post('/order_status')
  async orderstatus(
    @Body() paymentTransactionBasketDTO: PaymentTransactionBasketDTO,
    @Res() res: Response,
    @Req() req: Request,
    @Headers() headers,
  ) {
    const result = await this.transactionService.order_status(
      headers.tenant_id,
      paymentTransactionBasketDTO.transaction_basket_id,
    );
    return res.status(result.status).json(result);
  }

  @Render('test')
  @Get('/payment/postback/:tenant_id')
  async paymentPage(
    @Res() res: Response,
    @Query() query: { transaction_basket_id: number },
  ) {
    try {
      // console.log("request", request.body);
      const result = await this.transactionService.paymentPage(
        query.transaction_basket_id,
      );
      console.log('RESSSS', result.data);
      return result;
    } catch (error) {
      return { message: 'Something went wrong,' + error.message };
    }
  }

  @Render('payment_page')
  @Get('/postback/:tenant_id')
  async paymentPostback(
    @Req() request: Request,
    @Res() res: Response,
    @Query() query: { transaction_basket_id: number },
    @Param('tenant_id') tenant_id: string,
  ) {
    try {
      console.log('request', request.body);
      const result = await this.transactionService.order_status(
        tenant_id,
        query.transaction_basket_id,
      );
      return result;
    } catch (error) {
      return { message: 'Something went wrong,' + error.message };
    }
  }

  // @Render('payment_postback')
  // @Post('/postback/:tenant_id')
  // async paymentPostback(@Req() request: Request, @Res() res: Response) {
  //     try {
  //         console.log("request", request.body);
  //         let result = await this.transactionService.paymentPostback(request.body);
  //         return result;
  //     } catch (error) {
  //         return { message: "Something went wrong," + error.message }
  //     }
  // }

  @Render('payment_postback')
  @Get('/success')
  async dummySuccess(@Req() request: Request, @Res() res: Response) {
    try {
      const result = await this.transactionService.dummySuccess();
      return result;
    } catch (error) {
      return { message: 'Something went wrong,' + error.message };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/search_plans_by_name/')
  async getMfDetailByName(@Res() res: Response, @Query('name') name) {
    const result = await this.transactionService.getMfDetailByName(name);
    return res.status(result.status).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/getbenchmark_fund_details')
  async getBenchmarkMfFundDetail(@Res() res: Response) {
    const result = await this.transactionService.getBenchmarkMfFundDetail();
    return res.status(result.status).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/stop_systematic')
  async getStopSystematic(
    @Res() res: Response,
    @Headers() headers,
    @Query('fp_id') fp_id,
    @Query('type') type,
    @Query('cancellation_code') cancellation_code,
    @Query('reason') reason,
  ) {
    const result = await this.transactionService.stopSystematic(
      headers.user.id,
      type,
      fp_id,
      cancellation_code,
      reason,
    );
    return res.status(result.status).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/stop_non_mandate_systematic')
  async getStopNonMandateSystematic(
    @Res() res: Response,
    @Headers() headers,
    @Query('transaction_item_id') transaction_item_id,
  ) {
    const result = await this.transactionService.getStopNonMandateSystematic(
      headers.user.id,
      transaction_item_id,
    );
    return res.status(result.status).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/get_pending_three_days')
  async get_pending_three_days(@Res() res: Response, @Headers() headers) {
    const result = await this.transactionService.get_pending_three_days(
      headers.user.id,
    );
    return res.status(result.status).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/get_system_generated_pending')
  async get_system_generated_pending_baskets(
    @Res() res: Response,
    @Headers() headers,
  ) {
    const result =
      await this.transactionService.get_system_generated_pending_baskets(
        headers.user.id,
      );
    return res.status(result.status).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/get_basket_items')
  async get_basket_items(
    @Res() res: Response,
    @Headers() headers,
    @Query('transaction_basket_id') transaction_basket_id,
  ) {
    const result = await this.transactionService.get_basket_items(
      transaction_basket_id,
    );
    return res.status(result.status).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/deactivate_basket_items')
  async deactivate_basket_items(
    @Res() res: Response,
    @Headers() headers,
    @Query('transaction_basket_item_id') transaction_basket_item_id,
  ) {
    const result = await this.transactionService.deactivate_basket_item(
      transaction_basket_item_id,
      headers.user,
    );
    return res.status(result.status).json(result);
  }

  @Get('/postback/payment_page/:tenant_id')
  @Render('payment_page')
  async payment_page(
    @Res() res: Response,
    @Headers() headers,
    @Query('id') rzp_order_id,
    @Param('tenant_id') tenant_id,
  ) {
    const result = await this.transactionService.getPaymentPageResult(
      rzp_order_id,
      tenant_id,
    );
    return result;
  }

  @Post('/child_order_request')
  async child_order_password(
    @Res() res: Response,
    @Body() otpConsentBodyDto: ValidateConsentBodyDto,
  ) {
    const result = await this.transactionService.req_child(
      otpConsentBodyDto.transaction_basket_id,
    );
    return res.status(result.status).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @Get('total_sip')
  async get_sip_count(
    @Res() res: Response,
    @Headers() headers,
    @Query('year') year: number,
  ) {
    const result = await this.transactionService.get_sip_count(year);
    return res.status(result.status).json(result);
  }

  // @UseGuards(JwtAuthGuard)
  @Get('total_lumpsum')
  async get_lumpsum_count(
    @Res() res: Response,
    @Headers() headers,
    @Query('year') year: number,
  ) {
    const result = await this.transactionService.get_lumpsum_count(year);
    return res.status(result.status).json(result);
  }
}
