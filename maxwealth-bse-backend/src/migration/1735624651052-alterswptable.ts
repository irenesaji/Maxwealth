import { MigrationInterface, QueryRunner } from 'typeorm';

export class Alterswptable1735624651052 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`bse_swp_register\`
            MODIFY COLUMN \`start_date\` varchar(255)
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
