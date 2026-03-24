import { MigrationInterface, QueryRunner } from 'typeorm';

export class Modifyadhaarfeild1740646088329 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE user_onboarding_details 
            MODIFY COLUMN aadhaar_number VARCHAR(12);
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
