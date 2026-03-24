import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeMfPurchasePlanFields1731583069959
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE mf_purchase_plans 
            MODIFY COLUMN state varchar(20) NULL,
            MODIFY COLUMN systematic tinyint(1) NULL,
            MODIFY COLUMN auto_generate_instalments tinyint(1) NULL;`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
