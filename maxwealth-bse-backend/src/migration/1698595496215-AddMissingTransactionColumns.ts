import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMissingTransactionColumns1698595496215
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE redemptions add column failure_code varchar(30);`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
