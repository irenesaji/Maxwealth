import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFundIdToModelPortfolio1697698726071
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE model_portfolio_funds add column fund_plan_id int DEFAULT NULL;`,
    );
    await queryRunner.query(
      `ALTER TABLE model_portfolio_associated_funds add column fund_plan_id int DEFAULT NULL;`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
