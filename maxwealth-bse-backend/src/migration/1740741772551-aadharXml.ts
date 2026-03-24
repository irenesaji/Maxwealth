import { MigrationInterface, QueryRunner } from 'typeorm';

export class AadharXml1740741772551 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE user_onboarding_details 
            ADD COLUMN aadhar_xml LONGTEXT;
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
