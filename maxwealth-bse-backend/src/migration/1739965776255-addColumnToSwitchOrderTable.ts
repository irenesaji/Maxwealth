import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddColumnToSwitchOrderTable1739965776255
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE bse_switch_order
             ADD COLUMN register_no bigint
           `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
