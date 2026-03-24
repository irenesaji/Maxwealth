import { MigrationInterface, QueryRunner } from 'typeorm';

export class Signaturebufer1740390787355 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE user_onboarding_details 
            ADD COLUMN signature_buffer LONGTEXT;
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
