import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIdDocToOnboarding1708672688503 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE user_onboarding_details add column identity_document_id varchar(255)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
