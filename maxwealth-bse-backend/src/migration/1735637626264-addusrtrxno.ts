import { MigrationInterface, QueryRunner } from 'typeorm';

export class Addusrtrxno1735637626264 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
           
            ALTER TABLE transaction_reports
            ADD COLUMN usr_trx_no varchar(20)
          `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
