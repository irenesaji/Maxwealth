import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddColumntoXSipOrder1738218527511 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
           ALTER TABLE bse_xsip_order
            ADD COLUMN order_no bigint
          `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
