import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddColumnToswpRegister1738650953426 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`bse_swp_register\`
            ADD COLUMN \`swp_reg_id\` bigint,
            ADD COLUMN \`bse_remarks\` VARCHAR(255),
            ADD COLUMN \`success_flag\` int`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
