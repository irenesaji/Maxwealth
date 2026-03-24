import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeFpIdToTorusId1718788251136 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE user_address_details
        DROP COLUMN fp_id,
        ADD COLUMN user_onboarding_detail_id INT NOT NULL;
        `);

    await queryRunner.query(`ALTER TABLE email_addresses
        DROP COLUMN fp_id,
        DROP COLUMN profile,
        ADD COLUMN user_onboarding_detail_id INT NOT NULL;
        `);

    await queryRunner.query(`ALTER TABLE phone_numbers
        DROP COLUMN fp_id,
        DROP COLUMN profile,
        ADD COLUMN user_onboarding_detail_id INT NOT NULL;
        `);

    await queryRunner.query(`ALTER TABLE user_nominee_details
        DROP COLUMN fp_id,
        ADD COLUMN user_onboarding_detail_id INT NOT NULL;
        `);

    await queryRunner.query(`ALTER TABLE user_bank_details
        DROP COLUMN fp_bank_id,
        DROP COLUMN old_fp_bank_id,
        ADD COLUMN user_onboarding_detail_id INT NOT NULL;
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
