import { MigrationInterface, QueryRunner } from 'typeorm';

export class Savebuffers1739517519810 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE user_onboarding_details 
            ADD COLUMN photo_buffer BINARY(64) NULL,
            ADD COLUMN pan_buffer BINARY(64) NULL,
            ADD COLUMN address_proof_buffer BINARY(64) NULL,
            ADD COLUMN cheque_buffer BINARY(64) NULL;
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
