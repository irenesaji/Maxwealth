import { Module } from '@nestjs/common';
import { DataService } from './data.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserData } from './entities/data.entity';
import { ExcelModule } from 'src/excel/excel.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserData]), ExcelModule],
  providers: [DataService],
  exports: [DataService],
})
export class DataModule {}
