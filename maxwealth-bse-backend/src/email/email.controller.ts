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
} from '@nestjs/common';
import { EmailService } from './email.service';
import { Response } from 'express';

@Controller('email_controller')
export class EmailController {
  constructor(private readonly emailservice: EmailService) {}

  // @Post('/upload_file')
  // async manually_upload(@Res() res: Response, @Query('download_link') filepath, @Query('file_type') filetype) {
  //     let result = await this.emailservice.manually_upload(filepath, filetype)
  //     return res.status(result.status).json(result);
  // }

  // @Post('/upload_downloaded_file')
  // async manually_upload_downloaded_file(@Res() res: Response, @Query('download_link') filepath, @Query('file_type') filetype) {
  //     let result = await this.emailservice.manually_upload_files(filepath, filetype)
  //     return res.status(result.status).json(result);
  // }

  @Post('/process_cams')
  async processCAMSFiles(@Res() res: Response, @Query('directory') filepath) {
    const result = await this.emailservice.processFilesforCAMS(filepath, null);
    return res.status(200).json(result);
  }

  @Post('/process_karvy')
  async processKarvyFiles(@Res() res: Response, @Query('directory') filepath) {
    const result = await this.emailservice.processFilesforKarvy(filepath, null);
    return res.status(200).json(result);
  }
}
