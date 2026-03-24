import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddColumnToPurchaseOrderTable1739964413875
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
           ALTER TABLE bse_purchase_redemption_order
            ADD COLUMN reg_no bigint
          `);

    await queryRunner.query(`ALTER TABLE \`redemptions\`
            ADD COLUMN \`bse_order_no\` bigint`);

    await queryRunner.query(`ALTER TABLE \`switch_funds\`
                ADD COLUMN \`switch_order_no\` bigint`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
