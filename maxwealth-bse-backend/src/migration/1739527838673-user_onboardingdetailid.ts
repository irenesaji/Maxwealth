import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserOnboardingdetailid1739527838673 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE user_address_details 
            MODIFY COLUMN user_onboarding_detail_id int NULL;
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
