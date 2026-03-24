import { Module } from '@nestjs/common';
import { TransactionsourcesService } from './transactionsources.service';
import { TransactionsourcesController } from './transactionsources.controller';

@Module({
  controllers: [TransactionsourcesController],
  providers: [TransactionsourcesService],
})
export class TransactionsourcesModule {}
