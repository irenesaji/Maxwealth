import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMigrationToUserReturnsHistoryAndSmart1709790049233
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE user_returns_history add column day_change_percentage float`,
    );
    await queryRunner.query(
      `ALTER TABLE user_smart_returns_history add column day_change float`,
    );
    await queryRunner.query(
      `ALTER TABLE user_smart_returns_history add column day_change_percentage float`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
