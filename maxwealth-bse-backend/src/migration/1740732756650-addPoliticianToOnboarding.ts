import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPoliticianToOnboarding1740732756650
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE user_onboarding_details ADD COLUMN is_political tinyint NOT NULL DEFAULT 0, ADD COLUMN aof_document_url text`,
    );
    await queryRunner.query(
      `ALTER TABLE users ADD COLUMN expiry_time TIMESTAMP`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
