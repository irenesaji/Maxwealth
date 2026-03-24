import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangedatatypeTransactionReports1737622964913
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE transaction_reports
            MODIFY COLUMN amount DECIMAL(15,4),
            MODIFY COLUMN units DECIMAL(15,4),
            MODIFY COLUMN units_left DECIMAL(15,4),
            MODIFY COLUMN traded_at DECIMAL(15,4);
          `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
