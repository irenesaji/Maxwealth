import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserOnboardingUrls1739775394613 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE user_onboarding_details 
            ADD COLUMN pan_url varchar(255) NULL,
            ADD COLUMN aadhaar_url varchar(255) NULL,
            ADD COLUMN cheque_url varchar(255) NULL;
        `);
    await queryRunner.query(`
            ALTER TABLE user_address_details 
            DROP COLUMN pan_url,
            DROP COLUMN aadhaar_url,
            DROP COLUMN cheque_url;
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
