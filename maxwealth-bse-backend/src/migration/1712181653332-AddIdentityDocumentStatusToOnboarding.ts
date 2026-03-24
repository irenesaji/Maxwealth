import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIdentityDocumentStatusToOnboarding1712181653332
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE user_onboarding_details add column identity_document_status varchar(255)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
