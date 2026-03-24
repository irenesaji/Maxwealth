import { Controller, Post, Res } from '@nestjs/common';
import { BseService } from './bse.service';
import { Response } from 'express';

@Controller('bse')
export class BseController {
  constructor(private readonly bseService: BseService) {}

  @Post('token')
  async get_Token(@Res() res: Response) {
    const result = await this.bseService.access_token();
    return res.status(result.status).json(result);
  }
}
