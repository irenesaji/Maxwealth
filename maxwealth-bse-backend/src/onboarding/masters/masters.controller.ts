import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  Headers,
  HttpStatus,
  ParseFilePipe,
  Post,
  Query,
  Render,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { MastersService } from './masters.service';
import { Response, Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@Controller('api/onboarding/masters')
export class MastersController {
  constructor(private readonly mastersService: MastersService) {}

  @Get('/occupations')
  @UseGuards(JwtAuthGuard)
  async get_occupations(@Res() res: Response) {
    try {
      const result = await this.mastersService.get_occupations();
      console.log('res', result);

      return res.status(result.status).json(result);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        status: HttpStatus.BAD_REQUEST,
        error: 'sorry something went wrong, ' + error.message,
      });
    }
  }

  @Get('/countries')
  @UseGuards(JwtAuthGuard)
  async get_countries(@Res() res: Response) {
    try {
      const result = await this.mastersService.get_countries();
      console.log('res', result);

      return res.status(result.status).json(result);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        status: HttpStatus.BAD_REQUEST,
        error: 'sorry something went wrong, ' + error.message,
      });
    }
  }

  @Get('/address_types')
  @UseGuards(JwtAuthGuard)
  async get_address_types(@Res() res: Response) {
    try {
      const result = await this.mastersService.get_address_types();
      console.log('res', result);

      return res.status(result.status).json(result);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        status: HttpStatus.BAD_REQUEST,
        error: 'sorry something went wrong, ' + error.message,
      });
    }
  }

  @Get('/income_ranges')
  @UseGuards(JwtAuthGuard)
  async get_income_ranges(@Res() res: Response) {
    try {
      const result = await this.mastersService.get_income_ranges();
      console.log('res', result);

      return res.status(result.status).json(result);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        status: HttpStatus.BAD_REQUEST,
        error: 'sorry something went wrong, ' + error.message,
      });
    }
  }

  @Get('/kyc_account_types')
  @UseGuards(JwtAuthGuard)
  async get_kyc_account_types(@Res() res: Response) {
    try {
      const result = await this.mastersService.get_kyc_account_types();
      console.log('res', result);

      return res.status(result.status).json(result);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        status: HttpStatus.BAD_REQUEST,
        error: 'sorry something went wrong, ' + error.message,
      });
    }
  }

  @Get('/states')
  @UseGuards(JwtAuthGuard)
  async get_states(@Res() res: Response) {
    try {
      const result = await this.mastersService.get_states();
      console.log('res', result);

      return res.status(result.status).json(result);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        status: HttpStatus.BAD_REQUEST,
        error: 'sorry something went wrong, ' + error.message,
      });
    }
  }

  @Get('/tax_residencies')
  @UseGuards(JwtAuthGuard)
  async get_tax_residencies(@Res() res: Response) {
    try {
      const result = await this.mastersService.get_tax_residencies();
      console.log('res', result);

      return res.status(result.status).json(result);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        status: HttpStatus.BAD_REQUEST,
        error: 'sorry something went wrong, ' + error.message,
      });
    }
  }
}
