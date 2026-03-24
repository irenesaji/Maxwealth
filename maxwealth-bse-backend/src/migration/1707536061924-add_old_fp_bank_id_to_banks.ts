import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOldFpBankIdToBanks1707536061924 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE user_bank_details add column old_fp_bank_id int`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
