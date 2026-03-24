import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateOnboardingTableEsign1745387277717
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE user_onboarding_details 
            ADD COLUMN esign_transaction_id VARCHAR(255);
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
