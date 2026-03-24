import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSettingFlagsToUsers1693812309107 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE users add column is_daily_portfolio_updates tinyint not null default 1;`,
    );
    await queryRunner.query(
      `ALTER TABLE users add column is_whatsapp_notifications  tinyint not null default 1;`,
    );
    await queryRunner.query(
      `ALTER TABLE users add column is_enable_biometrics  tinyint not null default 1;`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
