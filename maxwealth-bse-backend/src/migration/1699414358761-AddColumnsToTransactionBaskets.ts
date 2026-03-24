import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddColumnsToTransactionBaskets1699414358761
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE transaction_baskets add column total_amount float;`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
