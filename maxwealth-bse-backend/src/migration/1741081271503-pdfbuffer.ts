import { MigrationInterface, QueryRunner } from 'typeorm';

export class Pdfbuffer1741081271503 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE user_onboarding_details 
            ADD COLUMN pdf_buffers LONGTEXT;
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
