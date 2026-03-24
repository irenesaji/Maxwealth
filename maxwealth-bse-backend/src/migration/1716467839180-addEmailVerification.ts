import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEmailVerification1716467839180 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`users\` 
            ADD COLUMN \`email_otp\` int,
            ADD COLUMN \`is_email_verified\` tinyint
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
