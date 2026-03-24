import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateFunddetailsColumn1741848017076
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE fund_details 
            MODIFY COLUMN isin VARCHAR(255) NULL;
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
