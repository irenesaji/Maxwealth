import { MigrationInterface, QueryRunner } from 'typeorm';

export class Modifysourcetable1731493624055 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
           
            ALTER TABLE sources
            ADD COLUMN source_transaction_id int,
            ADD CONSTRAINT source_transaction_id FOREIGN KEY (source_transaction_id) REFERENCES transaction_reports(id) ON DELETE CASCADE
          `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
