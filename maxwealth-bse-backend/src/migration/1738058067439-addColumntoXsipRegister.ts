import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddColumntoXsipRegister1738058067439
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`bse_xsip_register\`
            ADD COLUMN \`transaction_basket_item_id\` int`);

    await queryRunner.query(`ALTER TABLE \`bse_swp_register\`
            ADD COLUMN \`transaction_basket_item_id\` int`);

    await queryRunner.query(`ALTER TABLE \`bse_stp_register\`
            ADD COLUMN \`transaction_basket_item_id\` int`);

    await queryRunner.query(`ALTER TABLE \`bse_xsip_register\` 
            ADD CONSTRAINT \`FK_transac_basket_item\`
            FOREIGN KEY(\`transaction_basket_item_id\`) 
            REFERENCES transaction_basket_items(id) ON DELETE CASCADE`);

    await queryRunner.query(`ALTER TABLE \`bse_swp_register\` 
            ADD CONSTRAINT \`FK_tr_basket_item\`
            FOREIGN KEY(\`transaction_basket_item_id\`) 
            REFERENCES transaction_basket_items(id) ON DELETE CASCADE`);

    await queryRunner.query(`ALTER TABLE \`bse_stp_register\`
            ADD CONSTRAINT \`FK_t_basket_item\`
            FOREIGN KEY(\`transaction_basket_item_id\`) 
            REFERENCES transaction_basket_items(id) ON DELETE CASCADE`);
  }
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
