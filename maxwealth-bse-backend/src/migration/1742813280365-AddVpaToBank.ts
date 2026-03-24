import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddVpaToBank1742813280365 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user_bank_details\` ADD COLUMN \`vpa_id\` varchar(500) NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
