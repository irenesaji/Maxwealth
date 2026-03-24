import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateCostInflationIndexDto } from './dto/create-cii.dto';
import { UpdateCiiDto } from './dto/update-cii.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CostInflationIndex } from 'src/transactions/entities/cii.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CiiService {
  constructor(
    @InjectRepository(CostInflationIndex)
    private CostInflationIndexRepo: Repository<CostInflationIndex>,
  ) {}

  async create(createCostInflationIndexDto: CreateCostInflationIndexDto) {
    try {
      const fetch = await this.CostInflationIndexRepo.findOne({
        where: { financial_year: createCostInflationIndexDto.financial_year },
      });
      if (fetch) {
        return {
          status: HttpStatus.BAD_REQUEST,
          message: `Cost Inflation Index for the financial year ${createCostInflationIndexDto.financial_year} already exists`,
          data: fetch,
        };
      }
      const res = await this.CostInflationIndexRepo.save(
        createCostInflationIndexDto,
      );
      return { status: HttpStatus.OK, result: res };
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async findAll() {
    try {
      const res = await this.CostInflationIndexRepo.find();
      if (res.length == 0) {
        return { status: HttpStatus.BAD_REQUEST, message: 'Data Empty' };
      }
      return { status: HttpStatus.OK, result: res };
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async update(id: number, updateCiiDto: UpdateCiiDto) {
    try {
      const existingRecord = await this.CostInflationIndexRepo.findOne({
        where: { id },
      });
      if (!existingRecord) {
        return { status: HttpStatus.BAD_REQUEST, message: 'Data not found' };
      }
      Object.assign(existingRecord, updateCiiDto);
      const updatedRecord = await this.CostInflationIndexRepo.save(
        existingRecord,
      );
      return { status: HttpStatus.OK, result: updatedRecord };
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async remove(id: number) {
    try {
      const result = await this.CostInflationIndexRepo.findOne({
        where: { id },
      });
      if (!result) {
        return { status: HttpStatus.BAD_REQUEST, message: 'Data  Not Found' };
      }
      await this.CostInflationIndexRepo.delete({ id });
      return { status: HttpStatus.OK, Deleted: result };
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async findOne(id: number) {
    try {
      const res = await this.CostInflationIndexRepo.findOne({ where: { id } });
      if (!res) {
        return { status: HttpStatus.BAD_REQUEST, message: 'Data Empty' };
      }
      return { status: HttpStatus.OK, result: res };
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }
}
