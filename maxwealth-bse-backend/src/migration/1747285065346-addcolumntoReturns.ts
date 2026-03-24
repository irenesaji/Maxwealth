import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddcolumntoReturns1747285065346 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE user_returns_history_v2 
            ADD COLUMN invested_amount float,
            ADD COLUMN current_value float
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
