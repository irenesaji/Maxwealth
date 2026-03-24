import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { InvestorDetailsService } from './investor-details.service';

@Controller('investor-details')
export class InvestorDetailsController {
  constructor(
    private readonly investorDetailsService: InvestorDetailsService,
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadExcel(@UploadedFile() file: Express.Multer.File) {
    const filePath = file.path; // Assuming the file is saved to a specific path
    await this.investorDetailsService.Camsinvestors(filePath);
    return { message: 'Data imported successfully!' };
  }
}
