import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPdfUrlToOnboarding1723631222795 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`user_onboarding_details\`
            ADD COLUMN \`pdf_url\` text
        `);

    await queryRunner.query(`ALTER TABLE \`user_onboarding_details\`
            ADD COLUMN \`esigned_pdf_url\` text
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
