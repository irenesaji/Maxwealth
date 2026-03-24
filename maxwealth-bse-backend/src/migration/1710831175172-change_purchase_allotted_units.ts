import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangePurchaseAllottedUnits1710831175172
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE purchases modify allotted_units float;`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
