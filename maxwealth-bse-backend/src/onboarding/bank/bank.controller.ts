import {
  Body,
  Controller,
  Res,
  Headers,
  HttpStatus,
  Post,
  UseGuards,
  Get,
  Query,
  Patch,
} from '@nestjs/common';
import { BankService } from './bank.service';
import { AddUserBankDetailsDto } from './dtos/add-user-bank-details.dto';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@Controller('api/bank')
export class BankController {
  constructor(private readonly bankService: BankService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async add_user_bank_details(
    @Body() addBankDetailsDto: AddUserBankDetailsDto,
    @Headers() headers,
    @Res() res: Response,
  ) {
    try {
      const result = await this.bankService.add_user_bank_details(
        addBankDetailsDto,
      );
      return res.status(result.status).json(result);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        status: HttpStatus.BAD_REQUEST,
        error: 'sorry something went wrong, ' + error.message,
      });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('/add_additional_bank')
  async add_additional_bank(
    @Body() addBankDetailsDto: AddUserBankDetailsDto,
    @Headers() headers,
    @Res() res: Response,
  ) {
    try {
      const result = await this.bankService.add_additional_bank(
        addBankDetailsDto,
      );
      return res.status(result.status).json(result);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        status: HttpStatus.BAD_REQUEST,
        error: 'sorry something went wrong, ' + error.message,
      });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async get_user_bank_details(
    @Headers() headers,
    @Res() res: Response,
    @Query('user_id') user_id,
  ) {
    try {
      console.log(headers.user.id);
      const result = await this.bankService.get_user_bank_details(user_id);
      return res.status(result.status).json(result);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        status: HttpStatus.BAD_REQUEST,
        error: 'sorry something went wrong, ' + error.message,
      });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/all')
  async get_all_user_bank_details(
    @Headers() headers,
    @Res() res: Response,
    @Query('user_id') user_id,
  ) {
    try {
      console.log(headers.user.id);
      const result = await this.bankService.get_all_user_bank_details(user_id);
      return res.status(result.status).json(result);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        status: HttpStatus.BAD_REQUEST,
        error: 'sorry something went wrong, ' + error.message,
      });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/ifsc')
  async get_fp_ifsc_bank(
    @Headers() headers,
    @Res() res: Response,
    @Query('ifsc') ifsc,
  ) {
    try {
      console.log(headers.user.id);
      const result = await this.bankService.get_fp_bank_details(ifsc);
      return res.status(result.status).json(result);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        status: HttpStatus.BAD_REQUEST,
        error: 'sorry something went wrong, ' + error.message,
      });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/update_primary_account')
  async update_primary(
    @Headers() headers,
    @Res() res: Response,
    @Body() body: { id: number },
  ) {
    try {
      console.log(headers.user.id);
      const result = await this.bankService.update_primary(
        headers.user.id,
        body.id,
      );
      return res.status(result.status).json(result);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        status: HttpStatus.BAD_REQUEST,
        error: 'sorry something went wrong, ' + error.message,
      });
    }
  }
}
