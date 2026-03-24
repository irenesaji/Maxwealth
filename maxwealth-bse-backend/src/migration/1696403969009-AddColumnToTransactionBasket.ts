import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddColumnToTransactionBasket1696403969009
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE transaction_baskets add column created_by varchar(30) default 'user';`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
