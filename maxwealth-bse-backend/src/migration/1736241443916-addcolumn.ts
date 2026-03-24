import { MigrationInterface, QueryRunner } from 'typeorm';

export class Addcolumn1736241443916 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
           
            ALTER TABLE transaction_reports
            ADD COLUMN user_pan varchar(20)
          `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
