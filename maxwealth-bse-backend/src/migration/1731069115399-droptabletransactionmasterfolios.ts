import { MigrationInterface, QueryRunner } from 'typeorm';

export class Droptabletransactionmasterfolios1731069115399
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'DROP TABLE IF EXISTS kfintech_transaction_master_folios',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
