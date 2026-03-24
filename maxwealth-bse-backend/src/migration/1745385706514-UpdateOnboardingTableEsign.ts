import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateOnboardingTableEsign1745385706514
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE user_onboarding_details 
            ADD COLUMN esign_html TEXT;
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
