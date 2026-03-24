import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddColumnToPurchasesandPlansTable1732164550443
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`mf_purchase_plans\`
            ADD COLUMN \`sip_register_id\` varchar(255) 
        `);

    await queryRunner.query(`
            ALTER TABLE \`purchases\`
            ADD COLUMN \`sip_order_id\` varchar(255)
        `);

    await queryRunner.query(`
            ALTER TABLE \`redemptions\`
            ADD COLUMN \`swp_order_id\` varchar(255)
        `);

    await queryRunner.query(`
            ALTER TABLE \`mf_redemption_plans\`
             ADD COLUMN \`swp_register_id\` varchar(255)
        `);

    await queryRunner.query(`
            ALTER TABLE \`switch_funds\`
            ADD COLUMN \`stp_order_id\` varchar(255)
        `);

    await queryRunner.query(`
            ALTER TABLE \`mf_switch_plans\`
            ADD COLUMN \`stp_register_id\` varchar(255)
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
