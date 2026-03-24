import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangekfintechTransactionMasterFoliosDate1749104065394
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE kfintech_transaction_master_folios
            MODIFY COLUMN SIPREGDT VARCHAR(50);
          `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
