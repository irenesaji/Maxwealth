import { MigrationInterface, QueryRunner } from 'typeorm';

export class changeSwpAndStpId1689221885762 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE transaction_basket_items MODIFY fp_swp_id Varchar(255);
        `);

    await queryRunner.query(`
        ALTER TABLE transaction_basket_items MODIFY fp_stp_id Varchar(255);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
