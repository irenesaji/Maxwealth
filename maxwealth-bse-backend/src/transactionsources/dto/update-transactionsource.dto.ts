import { PartialType } from '@nestjs/swagger';
import { CreateTransactionSourceDto } from './create-transactionsource.dto';

export class UpdateTransactionsourceDto extends PartialType(
  CreateTransactionSourceDto,
) {}
