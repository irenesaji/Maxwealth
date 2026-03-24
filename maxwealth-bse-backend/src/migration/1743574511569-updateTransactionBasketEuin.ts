import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateTransactionBasketEuin1743574511569
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE transaction_baskets ADD COLUMN is_euin BOOLEAN DEFAULT 1`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
