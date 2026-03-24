import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddColumnToPurchasesMigration1698147807541
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE purchases add column reversed_at DATETIME;`,
    );
    await queryRunner.query(
      `ALTER TABLE purchases add column submitted_at DATETIME;`,
    );
    await queryRunner.query(
      `ALTER TABLE purchases add column succeeded_at DATETIME;`,
    );
    await queryRunner.query(
      `ALTER TABLE purchases add column scheduled_on DATETIME;`,
    );
    await queryRunner.query(
      `ALTER TABLE purchases add column traded_on DATETIME;`,
    );
    await queryRunner.query(
      `ALTER TABLE purchases add column allotted_units DATETIME;`,
    );
    await queryRunner.query(
      `ALTER TABLE purchases add column retried_at DATETIME;`,
    );
    await queryRunner.query(
      `ALTER TABLE purchases add column purchased_price float;`,
    );
    await queryRunner.query(
      `ALTER TABLE purchases add column confirmed_at DATETIME;`,
    );
    await queryRunner.query(
      `ALTER TABLE purchases add column failure_code varchar(30);`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
