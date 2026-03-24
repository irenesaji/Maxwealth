import { MigrationInterface, QueryRunner } from 'typeorm';

export class alterRiskProfiles1689507449881 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE risk_profiles add column model_portfolio_id int null;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
