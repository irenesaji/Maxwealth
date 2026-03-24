import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TransactionsourcesService } from './transactionsources.service';
import { CreateTransactionSourceDto } from './dto/create-transactionsource.dto';
import { UpdateTransactionsourceDto } from './dto/update-transactionsource.dto';

@Controller('transactionsources')
export class TransactionsourcesController {
  constructor(
    private readonly transactionsourcesService: TransactionsourcesService,
  ) {}

  @Post()
  create(@Body() createTransactionsourceDto: CreateTransactionSourceDto) {
    return this.transactionsourcesService.create(createTransactionsourceDto);
  }

  @Get()
  findAll() {
    return this.transactionsourcesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionsourcesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTransactionsourceDto: UpdateTransactionsourceDto,
  ) {
    return this.transactionsourcesService.update(
      +id,
      updateTransactionsourceDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transactionsourcesService.remove(+id);
  }
}
