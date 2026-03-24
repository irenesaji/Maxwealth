import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserOnboardingUrls1739768094704 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE user_address_details 
            ADD COLUMN pan_url varchar(255) NULL,
            ADD COLUMN aadhaar_url varchar(255) NULL,
            ADD COLUMN cheque_url varchar(255) NULL;
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
