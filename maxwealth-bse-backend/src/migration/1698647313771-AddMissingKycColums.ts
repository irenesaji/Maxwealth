import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMissingKycColums1698647313771 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE user_onboarding_details add column successful_at DATETIME;`,
    );
    await queryRunner.query(
      `ALTER TABLE user_onboarding_details add column rejected_at DATETIME;`,
    );

    await queryRunner.query(
      `ALTER TABLE mandates add column rejected_reason text;`,
    );
    await queryRunner.query(
      `ALTER TABLE mandates add column rejected_at DATETIME;`,
    );
    await queryRunner.query(
      `ALTER TABLE mandates add column received_at DATETIME;`,
    );
    await queryRunner.query(
      `ALTER TABLE mandates add column approved_at DATETIME;`,
    );
    await queryRunner.query(
      `ALTER TABLE mandates add column submitted_at DATETIME;`,
    );
    await queryRunner.query(
      `ALTER TABLE mandates add column cancelled_at DATETIME;`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
