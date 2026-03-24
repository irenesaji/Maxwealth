import { Injectable } from '@nestjs/common';
import { CreateTransactionSourceDto } from './dto/create-transactionsource.dto';
import { UpdateTransactionsourceDto } from './dto/update-transactionsource.dto';

@Injectable()
export class TransactionsourcesService {
  create(createTransactionsourceDto: CreateTransactionSourceDto) {
    return 'This action adds a new transactionsource';
  }

  findAll() {
    return `This action returns all transactionsources`;
  }

  findOne(id: number) {
    return `This action returns a #${id} transactionsource`;
  }

  update(id: number, updateTransactionsourceDto: UpdateTransactionsourceDto) {
    return `This action updates a #${id} transactionsource`;
  }

  remove(id: number) {
    return `This action removes a #${id} transactionsource`;
  }
}
