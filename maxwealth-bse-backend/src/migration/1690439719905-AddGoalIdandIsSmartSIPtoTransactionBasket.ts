import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddGoalIdandIsSmartSIPtoTransactionBasket1690439719905
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE transaction_baskets add column goal_id INT null;`,
    );
    await queryRunner.query(
      `ALTER TABLE transaction_baskets add column is_smart_sip tinyint NOT NULL DEFAULT 0;`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
