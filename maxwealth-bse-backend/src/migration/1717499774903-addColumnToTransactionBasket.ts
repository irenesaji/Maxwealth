import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddColumnToTransactionBasket1717499774903
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`transaction_baskets\`
            ADD COLUMN \`model_portfolio_id\` int
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
