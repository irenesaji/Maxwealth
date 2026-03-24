import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/users/entities/users.entity';
import { Repository } from 'typeorm';
import * as path from 'path';
import * as Exceljs from 'exceljs';
import * as fs from 'fs';
import * as csvParse from 'csv-parse';
import parse from 'csv-parse';
import * as XLSX from 'xlsx';
import { Transaction } from './entities/transaction.entity';
import axios from 'axios';
@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Users) private usersRepo: Repository<Users>,
    @InjectRepository(Transaction)
    private transactionRepo: Repository<Transaction>,
  ) {}

  async create(user_id: number, filepath: string) {
    const user = await this.usersRepo.findOne({ where: { id: user_id } });
    const ext = path.extname(filepath).toLowerCase();
    const data: CreateTransactionDto[] = [];

    try {
      const isindetail = await axios.post(
        'https://api.maxwealth.money/api/v1/mutual_funds/explore/explore_mutual_funds_by_rta_codes',
      );
      if (ext === '.xlsx') {
        const workbook = new Exceljs.Workbook();
        await workbook.xlsx.readFile(filepath);
        const worksheet = workbook.worksheets[0];

        worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
          if (rowNumber > 1) {
            const dto: CreateTransactionDto = {
              folio_number: row.getCell(5).value as string,
              user_id: user_id,
              isin: isindetail.data.isin,
              type: row.getCell(9).value as string,
              amount: row.getCell(21).value as number,
              units: row.getCell(20).value as number,
              traded_on: row.getCell(18).value as Date,
              traded_at: row.getCell(59).value as number,
              order: row.getCell(10).value as string,
              rta_order_reference: row.getCell(31).value as string,
              rta_product_code: row.getCell(1).value as string,
              rta_investment_option: row.getCell(7).value as string,
            };
            data.push(dto);
          }
        });
      }
      //  else if (ext === '.csv') {
      //   const fileContent = fs.readFileSync(filepath, 'utf-8');
      //   const records = await csvParse(fileContent, {
      //     columns: true,
      //     skip_empty_lines: true,
      //     trim: true,
      //   });

      //   records.forEach((record: any) => {
      //     const dto: CreateTransactionDto = {
      //       folio_number: record['folio_number'] as string,
      //       user_id: user_id,
      //       isin: isindetail.data.isin,
      //       type: record['transaction_head'] as string,
      //       amount: record['amount'] ? parseFloat(record['amount']) : null,
      //       units: record['units'] ? parseFloat(record['units']) : null,
      //       traded_on: record['transaction_date'] ? excelSerialDateToJSDate(record['transaction_date']) : null,
      //       traded_at: record['nav'] ? parseFloat(record['nav']) : null,
      //       order: record['transaction_number'] ? parseInt(record['transaction_number'], 10).toString() : null,
      //       rta_order_reference: record['transaction_id'] as string,
      //       rta_product_code: record['product_code'] as string,
      //       rta_investment_option: record['dividend_option'] as string,
      //     };
      //     data.push(dto);
      //   });
      // }
      else if (ext === '.xls') {
        const workbook = XLSX.readFile(filepath);
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        jsonData.forEach((record: any) => {
          const dto: CreateTransactionDto = {
            folio_number: record['folio_number'] as string,
            user_id: user_id,
            isin: isindetail.data.isin,
            type: record['transaction_head'] as string,
            amount: record['amount'] ? parseFloat(record['amount']) : null,
            units: record['units'] ? parseFloat(record['units']) : null,
            traded_on: record['transaction_date']
              ? excelSerialDateToJSDate(record['transaction_date'])
              : null,
            traded_at: record['nav'] ? parseFloat(record['nav']) : null,
            order: record['transaction_number']
              ? parseInt(record['transaction_number'], 10).toString()
              : null,
            rta_order_reference: record['transaction_id'] as string,
            rta_product_code: record['product_code'] as string,
            rta_investment_option: record['dividend_option'] as string,
          };
          data.push(dto);
        });
      } else {
        return {
          status: HttpStatus.BAD_REQUEST,
          error: 'Unsupported file type',
        };
      }

      const result = [];
      for (const record of data) {
        const existingRecord = await this.transactionRepo.findOne({
          where: { folio_number: record.folio_number },
        });

        if (existingRecord) {
          Object.assign(existingRecord, record);
          await this.transactionRepo.save(existingRecord);
          result.push(existingRecord);
        } else {
          await this.transactionRepo.save(record);
          result.push(record);
        }
      }

      return { status: 200, message: 'File processed successfully', result };
    } catch (error) {
      return {
        status: HttpStatus.BAD_REQUEST,
        error: 'Error processing file: ' + error.message,
      };
    } finally {
      // Ensure file cleanup
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
    }
  }

  findAll() {
    return 'This action returns all transactions';
  }

  findOne(id: number) {
    return `This action returns a #${id} transaction`;
  }

  update(id: number, updateTransactionDto: UpdateTransactionDto) {
    return `This action updates a #${id} transaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }
}

function excelSerialDateToJSDate(serial: number): Date {
  const excelEpoch = new Date(1899, 11, 30); // Excel's epoch starts from Dec 30, 1899
  const jsDate = new Date(excelEpoch.getTime() + serial * 86400000); // 86400000 ms in a day
  return jsDate;
}
