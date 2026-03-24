import { HttpStatus, Injectable } from '@nestjs/common';
import { UpdateUsergoalDto } from './dto/update-usergoal.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserGoals } from './entities/usergoal.entity';
import { CreateUserGoalsDto } from './dto/create-usergoal.dto';

@Injectable()
export class UsergoalsService {
  constructor(
    @InjectRepository(UserGoals) private usergoalsRepo: Repository<UserGoals>,
  ) {}

  async create(createUserGoalsDto: CreateUserGoalsDto) {
    try {
      const res = await this.usergoalsRepo.save(createUserGoalsDto);
      return { status: HttpStatus.OK, result: res };
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async findAll(user_id) {
    try {
      const res = await this.usergoalsRepo.find({
        where: { user_id: user_id },
      });
      // if (res.length == 0) {
      //   return { status: HttpStatus.OK, message: "Data Empty" };
      // }
      return { status: HttpStatus.OK, result: res };
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async update(id: number, updateUsergoalDto: UpdateUsergoalDto) {
    try {
      const existingRecord = await this.usergoalsRepo.findOne({
        where: { id },
      });
      if (!existingRecord) {
        return { status: HttpStatus.BAD_REQUEST, message: 'Data not found' };
      }
      Object.assign(existingRecord, updateUsergoalDto);
      const updatedRecord = await this.usergoalsRepo.save(existingRecord);
      return { status: HttpStatus.OK, result: updatedRecord };
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async remove(id: number) {
    try {
      const result = await this.usergoalsRepo.findOne({ where: { id } });
      if (!result) {
        return { status: HttpStatus.BAD_REQUEST, message: 'Data  Not Found' };
      }
      await this.usergoalsRepo.delete({ id });
      return { status: HttpStatus.OK, Deleted: result };
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async findOne(id: number) {
    try {
      const res = await this.usergoalsRepo.findOne({ where: { id } });
      if (!res) {
        return { status: HttpStatus.BAD_REQUEST, message: 'Data Empty' };
      }
      return { status: HttpStatus.OK, result: res };
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }
}
