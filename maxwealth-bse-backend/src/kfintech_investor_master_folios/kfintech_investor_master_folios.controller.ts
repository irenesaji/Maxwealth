import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  UseInterceptors,
  UploadedFile,
  HttpStatus,
  Headers,
} from '@nestjs/common';
import { KfintechInvestorMasterFoliosService } from './kfintech_investor_master_folios.service';
import { CreateKfintechInvestorMasterFolioDto } from './dto/create-kfintech_investor_master_folio.dto';
import { UpdateKfintechInvestorMasterFolioDto } from './dto/update-kfintech_investor_master_folio.dto';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'multer.config';

@Controller('kfintech-investor-master-folios')
export class KfintechInvestorMasterFoliosController {
  constructor(
    private readonly kfintechInvestorMasterFoliosService: KfintechInvestorMasterFoliosService,
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
    const result = await this.kfintechInvestorMasterFoliosService.create(
      file.path,
    );
    return res.status(result.status).json(result);
  }

  @Get()
  findAll() {
    return this.kfintechInvestorMasterFoliosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.kfintechInvestorMasterFoliosService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body()
    updateKfintechInvestorMasterFolioDto: UpdateKfintechInvestorMasterFolioDto,
  ) {
    return this.kfintechInvestorMasterFoliosService.update(
      +id,
      updateKfintechInvestorMasterFolioDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.kfintechInvestorMasterFoliosService.remove(+id);
  }

  // @Post('/build_XML')
  // async buildXML(@Res() res:Response,){
  //   let result = await this.kfintechInvestorMasterFoliosService.buildXML()
  //   return res.status(result.status).json(result)
  // }
}
