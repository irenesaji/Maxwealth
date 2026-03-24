import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  Res,
  Headers,
  UploadedFile,
  HttpStatus,
} from '@nestjs/common';
import { CamsInvestorMasterFoliosService } from './cams_investor_master_folios.service';
import { CreateCamsInvestorMasterFolioDto } from './dto/create-cams_investor_master_folio.dto';
import { UpdateCamsInvestorMasterFolioDto } from './dto/update-cams_investor_master_folio.dto';
import { multerConfig } from 'multer.config';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

@Controller('cams-investor-master-folios')
export class CamsInvestorMasterFoliosController {
  constructor(
    private readonly camsInvestorMasterFoliosService: CamsInvestorMasterFoliosService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async create(
    @Res() res: Response,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const validMimeTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
      'text/csv', // .csv
    ];
    if (!validMimeTypes.includes(file.mimetype)) {
      return { status: HttpStatus.BAD_REQUEST, error: 'Invalid file type' };
    }
    const result = await this.camsInvestorMasterFoliosService.investor_reports(
      file.path,
    );
    return res.status(result.status).json(result);
  }

  @Get()
  findAll() {
    return this.camsInvestorMasterFoliosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.camsInvestorMasterFoliosService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCamsInvestorMasterFolioDto: UpdateCamsInvestorMasterFolioDto,
  ) {
    return this.camsInvestorMasterFoliosService.update(
      +id,
      updateCamsInvestorMasterFolioDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.camsInvestorMasterFoliosService.remove(+id);
  }
}
