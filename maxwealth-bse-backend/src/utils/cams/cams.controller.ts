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
  UseInterceptors,
  UploadedFile,
  Render,
  Req,
} from '@nestjs/common';
import { CamsService } from './cams.service';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('/api/cams')
export class CamsController {
  constructor(private readonly camsService: CamsService) {}

  @Get('token')
  async getToken(@Res() res: Response) {
    const result = await this.camsService.get_cams_token();
    return res.status(200).json(result);
  }

  @Post('check_kyc')
  async check_kyc(@Res() res: Response, @Body() body) {
    const result = await this.camsService.check_kyc(body.pan);
    return res.status(200).json(result);
  }

  @Post('upload_pan')
  async upload_pan(@Res() res: Response, @Body() body) {
    const result = await this.camsService.upload_pan(body);
    return res.status(200).json(result);
  }

  @Post('digilocker')
  async digilocker(@Res() res: Response, @Body() body) {
    const result = await this.camsService.digilocker(body);
    return res.status(200).json(result);
  }

  @Post('digilocker/:user_id/postback/:tenant')
  @Render('digilocker_postback')
  async postback(@Body() data, @Param() user_id) {
    const result = await this.camsService.digilocker_postback(data, user_id);
    return result;
  }

  @Post('web/digilocker/:user_id/postback/:tenant')
  @Render('digilocker_web_postback')
  async web_postback(@Body() data, @Param() user_id) {
    console.log('Web web');
    const result = await this.camsService.digilocker_postback(data, user_id);
    return result;
  }

  // @Get('/success')
  // @Render('digilocker_postback')
  // async dummySuccess(@Req() request: Request) {
  //   try {
  //     let result = await this.camsService.dummySuccess();
  //     return result;

  //   } catch (error) {
  //     return { message: "Something went wrong," + error.message }
  //   }
  // }

  @Get('/success')
  async dummySuccess(@Req() request: Request, @Res() response: Response) {
    try {
      const tenantId = request.headers['tenant_id'] || process.env.TENANT_ID;

      // Set the tenant_id in the response headers
      response.setHeader('tenant_id', tenantId);

      // Fetch result from the service
      const result = await this.camsService.dummySuccess();

      // Render the Handlebars template and pass data
      response.render('digilocker_postback', { data: result, tenantId });
    } catch (error) {
      throw new Error('Something went wrong.');
    }
  }

  @Post('download_pan')
  async download_pan(@Res() res: Response, @Body() body) {
    const result = await this.camsService.download_pan(body.pan, body.dob);
    return res.status(200).json(result);
  }

  @Post('convert')
  @UseInterceptors(FileInterceptor('file')) // Handle single file upload
  async convert(
    @Res() res: Response,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const result = await this.camsService.convertPdfToBase64(file.buffer);
    return res.status(200).json(result);
  }
}
