import { MigrationInterface, QueryRunner } from 'typeorm';

export class StatusFieldToOnboarding1719201960250
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`user_onboarding_details\`
        ADD COLUMN \`onboarding_status\` varchar(255)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
