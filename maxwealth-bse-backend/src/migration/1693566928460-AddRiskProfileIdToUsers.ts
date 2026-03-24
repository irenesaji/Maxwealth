import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRiskProfileIdToUsers1693566928460
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE users add column risk_profile_id int null;`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
