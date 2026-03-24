import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddcolumntoOnboarding1747303225371 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE user_onboarding_details 
            ADD COLUMN verified_aadhaar_number VARCHAR(12)
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
