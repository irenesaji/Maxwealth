import { MigrationInterface, QueryRunner } from 'typeorm';

export class Sourcestableupdate1731391530126 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE transaction_reports
              DROP COLUMN sources;
          `);

    await queryRunner.query(`
            CREATE TABLE sources (
              id INT PRIMARY KEY AUTO_INCREMENT,
              transaction_report_id INT,
              gain DECIMAL(10, 2) NULL,
              units DECIMAL(10, 2) NULL,
              days_held DECIMAL(10, 2) NULL,
              purchased_at DECIMAL(10, 4) NULL,
              purchased_on TIMESTAMP NULL,
              FOREIGN KEY (transaction_report_id) REFERENCES transaction_reports(id) ON DELETE CASCADE
            );
          `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
