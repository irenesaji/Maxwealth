import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class CsvService {
  saveCsvToFile(csvData: string, filePath: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      fs.writeFile(filePath, csvData, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  async deleteFile(filePath: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      fs.unlink(filePath, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}
