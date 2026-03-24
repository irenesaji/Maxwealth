import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateFundDetailDto } from './dto/create-fund_detail.dto';
import { UpdateFundDetailDto } from './dto/update-fund_detail.dto';
import { TextDocumentDto } from './dto/textDocument.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TextDocument } from './entities/text_document.entity';
import { Repository } from 'typeorm';
import { FundDetail } from './entities/fund_detail.entity';
import { ConfigService } from '@nestjs/config';
import path from 'path';
import * as fs from 'fs';
import { FundDetailsRepository } from 'src/repositories/fund_details.repository';
import { TextDocumentRepository } from 'src/repositories/text_document.repository';

@Injectable()
export class FundDetailsService {
  dirPath: string;
  url: string;
  constructor(
    private textDocumentRepo: TextDocumentRepository,
    private fundDetailRepo: FundDetailsRepository,
  ) {
    const configService = new ConfigService();
    this.dirPath = configService.get('FILE_PATH');
    this.url = configService.get('BASE_URL');
  }
  create(createFundDetailDto: CreateFundDetailDto) {
    return 'This action adds a new fundDetail';
  }

  async uploadfile(txtfile: Express.Multer.File) {
    try {
      if (txtfile == null) {
        return { status: HttpStatus.NOT_FOUND, error: 'Upload the file' };
      }

      const dto = new TextDocumentDto();
      dto.file_name = this.url + '/' + txtfile.path;
      const result = await this.textDocumentRepo.save(dto);
      console.log('resultt', result);
      console.log('file', result.file_name);
      const store_datainDB = await this.storeTextDocument(txtfile.path);
      console.log('Data stored in Database');
      return { status: HttpStatus.OK, file: result };
    } catch (err) {
      console.error('Error uploading the file:', err);
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async storeTextDocument(fileUrl: string) {
    try {
      console.log('fileurl', fileUrl);
      const fileContent = fs.readFileSync(fileUrl, 'utf-8');
      // console.log("fileContent", fileContent)
      const rows = fileContent.split('\n'); // Split file into lines
      const dataRows = rows.slice(1);
      const parsedData = dataRows.map((row) => {
        const fields = row.split('|'); // Assuming "|" is the delimiter
        return {
          uniqueNo: fields[0],
          schemeCode: fields[1],
          rtaSchemeCode: fields[2],
          amcSchemeCode: fields[3],
          isin: fields[4],
          amcCode: fields[5],
          schemeType: fields[6],
          schemePlan: fields[7],
          schemeName: fields[8],
          purchaseAllowed:
            fields[9]?.toUpperCase() === 'Y' || fields[9] === '1',
          // purchaseAllowed: fields[9] ? fields[9].toUpperCase() === 'Y' || fields[9] === '1'
          //   : 'N',
          // purchaseAllowed: fields[9],
          purchaseTransactionMode: fields[10],
          minimumPurchaseAmount: fields[11] ? parseFloat(fields[11]) : 0,
          additionalPurchaseAmount: fields[12] ? parseFloat(fields[12]) : 0,
          maximumPurchaseAmount: fields[13] ? parseFloat(fields[13]) : 0,
          purchaseAmountMultiplier: fields[14] ? parseFloat(fields[14]) : 0,
          purchaseCutoffTime: fields[15],
          redemptionAllowed:
            fields[16]?.toUpperCase() === 'Y' || fields[16] === '1',
          // redemptionAllowed: fields[16] ? fields[16].toUpperCase() === 'Y' || fields[16] === '1' : 'N',
          redemptionTransactionMode: fields[17],
          minimumRedemptionQty: fields[18] ? parseFloat(fields[18]) : 0,
          redemptionQtyMultiplier: fields[19] ? parseFloat(fields[19]) : 0,
          maximumRedemptionQty: fields[20] ? parseFloat(fields[20]) : 0,
          redemptionAmountMinimum: fields[21] ? parseFloat(fields[21]) : 0,
          redemptionAmountMaximum: fields[22] ? parseFloat(fields[22]) : 0,
          redemptionAmountMultiple: fields[23] ? parseFloat(fields[23]) : 0,
          redemptionCutoffTime: fields[24],
          rtaAgentCode: fields[25],
          amcActiveFlag:
            fields[26]?.toUpperCase() === 'Y' || fields[26] === '1',
          dividendReinvestmentFlag:
            fields[27]?.toUpperCase() === 'Y' || fields[27] === '1',
          sipFlag: fields[28]?.toUpperCase() === 'Y' || fields[28] === '1',
          stpFlag: fields[29]?.toUpperCase() === 'Y' || fields[29] === '1',
          swpFlag: fields[30]?.toUpperCase() === 'Y' || fields[30] === '1',
          switchFlag: fields[31]?.toUpperCase() === 'Y' || fields[31] === '1',
          // amcActiveFlag: fields[26] ? fields[26] === '1' || fields[26].toUpperCase() === 'Y' : 0,
          // dividendReinvestmentFlag: fields[27] ? fields[27].toUpperCase() === 'Y' || fields[27] === '1' : 'N',
          // sipFlag: fields[28] ? fields[28].toUpperCase() === 'Y' || fields[28] === '1' : 'N',
          // stpFlag: fields[29] ? fields[29].toUpperCase() === 'Y' || fields[29] === '1' : 'N',
          // swpFlag: fields[30] ? fields[30].toUpperCase() === 'Y' || fields[30] === '1' : 'N',
          // switchFlag: fields[31] ? fields[31].toUpperCase() === 'Y' || fields[31] === '1' : 'N',
          settlementType: fields[32],
          amcInd: fields[33],
          faceValue: fields[34] ? parseFloat(fields[34]) : 0,
          startDate: fields[35]
            ? new Date(fields[35]).toISOString().split('T')[0]
            : new Date().toISOString().split('T')[0],
          endDate: fields[36]
            ? new Date(fields[36]).toISOString().split('T')[0]
            : new Date().toISOString().split('T')[0],
          exitLoadFlag: fields[37]?.toUpperCase() === 'Y' || fields[30] === '1',
          // exitLoadFlag: fields[37] ? fields[37].toUpperCase() === 'Y' || fields[30] === '1' : 'N',
          exitLoad: fields[38],
          lockInPeriodFlag:
            fields[39]?.toUpperCase() === 'Y' || fields[30] === '1',
          // lockInPeriodFlag: fields[39] ? fields[37].toUpperCase() === 'Y' || fields[30] === '1' : 'N',
          lockInPeriod: fields[40],
          channelPartnerCode: fields[41],
          reopeningDate: fields[42]
            ? new Date(fields[42]).toISOString().split('T')[0]
            : new Date().toISOString().split('T')[0],
        };
      });

      // console.log('Parsed data:', parsedData);

      // Save the parsed data to the database
      for (const record of parsedData) {
        const newEntity = await this.fundDetailRepo.save(record);
        // console.log("newEntity",newEntity)
      }

      return {
        status: 200,
        message: 'File processed and data stored successfully.',
      };
    } catch (err) {
      console.log('error', err);
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  findAll() {
    return `This action returns all fundDetails`;
  }

  findOne(id: number) {
    return `This action returns a #${id} fundDetail`;
  }

  update(id: number, updateFundDetailDto: UpdateFundDetailDto) {
    return `This action updates a #${id} fundDetail`;
  }

  remove(id: number) {
    return `This action removes a #${id} fundDetail`;
  }
}
