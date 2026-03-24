import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateNomineeAddress1749035487458 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE user_nominee_details
            ADD COLUMN address_line_1 TEXT NULL,
            ADD COLUMN address_line_2 TEXT NULL,
            ADD COLUMN address_line_3 TEXT NULL
            `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
