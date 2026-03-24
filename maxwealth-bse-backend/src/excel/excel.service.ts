import * as XLSX from 'xlsx';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ExcelService {
  async readExcel(filePath: string) {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Convert the sheet data into JSON format
    const data = XLSX.utils.sheet_to_json(worksheet);

    console.log(data);
    return data;
  }
}
