import { MigrationInterface, QueryRunner } from 'typeorm';

export class Updatefieldstransactionreport1735644668218
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE transaction_reports 
            MODIFY COLUMN traded_at DECIMAL(10, 2);
          `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
