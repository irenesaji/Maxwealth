import { Injectable } from '@nestjs/common';
import { CreateFileprocessDto } from './dto/create-fileprocess.dto';
import { UpdateFileprocessDto } from './dto/update-fileprocess.dto';

@Injectable()
export class FileprocessService {
  create(createFileprocessDto: CreateFileprocessDto) {
    return 'This action adds a new fileprocess';
  }

  findAll() {
    return `This action returns all fileprocess`;
  }

  findOne(id: number) {
    return `This action returns a #${id} fileprocess`;
  }

  update(id: number, updateFileprocessDto: UpdateFileprocessDto) {
    return `This action updates a #${id} fileprocess`;
  }

  remove(id: number) {
    return `This action removes a #${id} fileprocess`;
  }
}
