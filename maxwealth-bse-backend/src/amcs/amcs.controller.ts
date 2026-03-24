import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Res,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { AmcsService } from './amcs.service';
import { Response } from 'express';

@Controller('api/amcs')
export class AmcsController {
  constructor(private readonly amcsService: AmcsService) {}

  // @UseGuards(JwtAuthGuard)
  @Get()
  async getallActive(@Res() res: Response) {
    try {
      const result = await this.amcsService.get_all_active();

      return res.status(result.status).json(result);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        status: HttpStatus.BAD_REQUEST,
        error: 'sorry something went wrong, ' + error.message,
      });
    }
  }

  @Get('/:id')
  async getbyid(@Param('id') id: number, @Res() res: Response) {
    try {
      const result = await this.amcsService.getbyId(id);

      return res.status(result.status).json(result);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        status: HttpStatus.BAD_REQUEST,
        error: 'sorry something went wrong, ' + error.message,
      });
    }
  }
}
