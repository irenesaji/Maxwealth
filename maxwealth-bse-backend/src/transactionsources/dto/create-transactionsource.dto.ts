export class CreateTransactionSourceDto {
  transactionId: number;

  daysHeld?: number;

  units?: number;

  purchasedOn?: Date;

  purchasedAt?: string;

  gain?: number;

  user_id: number;
}
