import { MigrationInterface, QueryRunner } from 'typeorm';

export class Addunitslefttotrannsactionreports1731497573314
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
           
            ALTER TABLE transaction_reports
            ADD COLUMN units_left bigint
          `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
