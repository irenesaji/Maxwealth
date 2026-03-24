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
  UploadedFile,
  Query,
} from '@nestjs/common';
import { FundDetailsService } from './fund_details.service';
import { CreateFundDetailDto } from './dto/create-fund_detail.dto';
import { UpdateFundDetailDto } from './dto/update-fund_detail.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName, FileFilter } from 'file_feature';
import { Response } from 'express';

@Controller('fund-details')
export class FundDetailsController {
  constructor(private readonly fundDetailsService: FundDetailsService) {}

  @Post()
  create(@Body() createFundDetailDto: CreateFundDetailDto) {
    return this.fundDetailsService.create(createFundDetailDto);
  }

  @Post('/uploadFile')
  @UseInterceptors(
    FileInterceptor('text_file', {
      storage: diskStorage({
        destination: './uploads/text_file',
        filename: editFileName,
      }),
      fileFilter: FileFilter,
    }),
  )
  async uploadFile(
    @Res() res: Response,
    @UploadedFile() txtfile: Express.Multer.File,
  ) {
    const result = await this.fundDetailsService.uploadfile(txtfile);
    return res.status(result.status).json(result);
  }

  @Get('/save_document')
  async save_document(
    @Res() res: Response,
    @Query('filepath') filepath: string,
  ) {
    console.log('save_doc');
    const result = await this.fundDetailsService.storeTextDocument(filepath);
    return res.status(result.status).json(result);
  }

  @Get()
  findAll() {
    return this.fundDetailsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fundDetailsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFundDetailDto: UpdateFundDetailDto,
  ) {
    return this.fundDetailsService.update(+id, updateFundDetailDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fundDetailsService.remove(+id);
  }
}
