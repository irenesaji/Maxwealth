import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeMfPurchasePlanTableFields1731583551006
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE mf_purchase_plans 
            MODIFY COLUMN installment_day int NULL,
            MODIFY COLUMN start_date Date NULL,
            MODIFY COLUMN number_of_installments int NULL;`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
