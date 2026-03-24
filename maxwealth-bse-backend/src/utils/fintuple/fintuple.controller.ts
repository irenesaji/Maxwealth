import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Query,
  Req,
  Render,
} from '@nestjs/common';
import { FintupleService } from './fintuple.service';
import { CreateFintupleDto } from './dto/create-fintuple.dto';
import { UpdateFintupleDto } from './dto/update-fintuple.dto';
import { Response } from 'express';

@Controller('api/fintuple')
export class FintupleController {
  constructor(private readonly fintupleService: FintupleService) {}

  @Post('/generate_token')
  async generate_token(@Res() res: Response) {
    const result = await this.fintupleService.get_esign_token();
    return res.status(200).json(result);
  }

  @Post('/initiate_esign')
  async initiate_esign(@Body('user_id') user_id: any, @Res() res: Response) {
    const result = await this.fintupleService.initiate_esign(user_id);
    return res.status(200).json(result);
  }

  @Post('/generate_consent')
  async generate_consent(
    @Body('transaction_id') transaction_id: any,
    @Res() res: Response,
  ) {
    const result = await this.fintupleService.generate_consent(transaction_id);
    return res.status(200).json(result);
  }

  @Get('/get_pdf')
  async get_pdf(
    @Query('transaction_id') transaction_id: any,
    @Res() res: Response,
  ) {
    const result = await this.fintupleService.get_pdf(transaction_id);
    return res.status(200).json(result);
  }

  @Get('/transaction_status')
  async transaction_status(
    @Query('transaction_id') transaction_id: any,
    @Res() res: Response,
  ) {
    const result = await this.fintupleService.get_transaction_status(
      transaction_id,
    );
    return res.status(200).json(result);
  }

  @Post('esign/:user_id/postback/:tenant')
  @Render('esign_postback')
  async postback(@Body() data, @Param() user_id) {
    const result = await this.fintupleService.esign_postback(data, user_id);
    return result;
  }

  @Get('/success')
  async dummySuccess(@Req() request: Request, @Res() res: Response) {
    const result = await this.fintupleService.dummySuccess();
    return res.status(200).json(result);
  }
}
