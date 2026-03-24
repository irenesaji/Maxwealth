import { MigrationInterface, QueryRunner } from 'typeorm';

export class Updatecolumns1740379257075 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE user_onboarding_details 
            MODIFY COLUMN pan_buffer LONGTEXT,
            MODIFY COLUMN address_proof_buffer LONGTEXT,
            MODIFY COLUMN photo_buffer LONGTEXT,
            MODIFY COLUMN cheque_buffer LONGTEXT;
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
