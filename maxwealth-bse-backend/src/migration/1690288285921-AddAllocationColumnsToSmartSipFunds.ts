import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAllocationColumnsToSmartSipFunds1690288285921
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE smart_sip_funds add column debt_scheme_allocation float not null;`,
    );

    await queryRunner.query(
      `ALTER TABLE smart_sip_funds add column equity_scheme_allocation float not null;`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
