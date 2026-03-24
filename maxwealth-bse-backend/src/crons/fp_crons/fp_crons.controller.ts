import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { FpCronsService } from './fp_crons.service';
import { Response } from 'express';
@Controller('api/fp-crons')
export class FpCronsController {
  constructor(private readonly fpCronService: FpCronsService) {}

  // @Get('/purchases-sync')
  // async purchasesSync(@Res() res: Response) {
  //     try {
  //         this.fpCronService.purchasesSync();
  //         return res.status(HttpStatus.OK).json({ "status": "ok" });
  //     } catch (err) {

  //     }
  // }

  // @Get('/findFundDetails')
  // async findFunds(@Res() res:Response)
  // {
  //     let result= await this.fpCronService.findAllFunds()
  //     return res.status(result.status).json(result)
  // }

  @Get('v2/holdings')
  async holdings_v2(@Res() res: Response) {
    try {
      const result = await this.fpCronService.holdingDataSync_v4();
      return res.status(HttpStatus.OK).json({ status: 'ok' });
    } catch (err) {}
  }

  @Get('v2/read_emails')
  async handle_cron(@Res() res: Response) {
    try {
      const result = await this.fpCronService.handleCron();
      return res.status(HttpStatus.OK).json({ status: 'ok' });
    } catch (err) {}
  }

  @Get('capital_gains')
  async capital_gains(@Res() res: Response) {
    try {
      const result = await this.fpCronService.capital_gains();
      return res.status(HttpStatus.OK).json({ status: 'ok' });
    } catch (err) {}
  }

  @Get('capital_gains_yearly')
  async capital_gains_yearly(@Res() res: Response) {
    try {
      const result = await this.fpCronService.capital_gains_yearly();
      return res.status(HttpStatus.OK).json({ status: 'ok' });
    } catch (err) {}
  }
}
