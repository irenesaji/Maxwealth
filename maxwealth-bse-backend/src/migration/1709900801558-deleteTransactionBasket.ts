import { MigrationInterface, QueryRunner } from 'typeorm';

export class DeleteTransactionBasket1709900801558
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE transaction_basket_items add column is_active tinyint(1) default 1`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
