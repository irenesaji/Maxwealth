import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddflagtotransactionReports1731496625705
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
           
            ALTER TABLE transaction_reports
            ADD COLUMN is_processed boolean default false
          `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
