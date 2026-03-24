import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserData } from './entities/data.entity';
import { ExcelService } from 'src/excel/excel.service';

@Injectable()
export class DataService {
  constructor(
    @InjectRepository(UserData)
    private userDataRepository: Repository<UserData>,
    private excelService: ExcelService,
  ) {}

  async saveExcelData(filePath: string) {
    const data = await this.excelService.readExcel(filePath);

    for (const row of data) {
      const newUserData = new UserData();
      newUserData.name = row['Name'];
      newUserData.email = row['Email'];
      newUserData.age = row['Age'];

      await this.userDataRepository.save(newUserData);
    }
  }
}
