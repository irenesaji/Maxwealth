import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIsPaymentFlagToTransactionBasketItems1699438301406
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE transaction_basket_items add column is_payment tinyint(1) default true not null;`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
