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
import { KfintechTransactionMasterFoliosService } from './kfintech_transaction_master_folios.service';
import { CreateKfintechTransactionMasterFolioDto } from './dto/create-kfintech_transaction_master_folio.dto';
import { UpdateKfintechTransactionMasterFolioDto } from './dto/update-kfintech_transaction_master_folio.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'multer.config';
import { Response } from 'express';

@Controller('kfintech-transaction-master-folios')
export class KfintechTransactionMasterFoliosController {
  constructor(
    private readonly kfintechTransactionMasterFoliosService: KfintechTransactionMasterFoliosService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async create(
    @Res() res: Response,
    @Headers() header,
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
    const result = await this.kfintechTransactionMasterFoliosService.create(
      file.path,
    );
    return res.status(result.status).json(result);
  }

  @Get()
  findAll() {
    return this.kfintechTransactionMasterFoliosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.kfintechTransactionMasterFoliosService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body()
    updateKfintechTransactionMasterFolioDto: UpdateKfintechTransactionMasterFolioDto,
  ) {
    return this.kfintechTransactionMasterFoliosService.update(
      +id,
      updateKfintechTransactionMasterFolioDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.kfintechTransactionMasterFoliosService.remove(+id);
  }
}
