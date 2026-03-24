import { MigrationInterface, QueryRunner } from 'typeorm';

export class Altertype1732260490086 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE transaction_reports 
            MODIFY COLUMN type VARCHAR(255);
          `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
