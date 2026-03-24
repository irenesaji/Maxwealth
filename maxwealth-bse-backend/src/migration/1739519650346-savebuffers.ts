import { MigrationInterface, QueryRunner } from 'typeorm';

export class Savebuffers1739519650346 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE user_onboarding_details 
            MODIFY COLUMN photo_buffer VARCHAR(255) NULL,
            MODIFY COLUMN pan_buffer VARCHAR(255) NULL,
            MODIFY COLUMN address_proof_buffer VARCHAR(255) NULL,
            MODIFY COLUMN cheque_buffer VARCHAR(255) NULL;
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
