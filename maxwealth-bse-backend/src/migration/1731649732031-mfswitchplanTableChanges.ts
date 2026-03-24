import { MigrationInterface, QueryRunner } from 'typeorm';

export class MfswitchplanTableChanges1731649732031
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE mf_switch_plans 
            MODIFY COLUMN state varchar(20) NULL,
            MODIFY COLUMN installment_day int NULL,
            MODIFY COLUMN start_date Date NULL,
            MODIFY COLUMN end_date Date NULL,
            MODIFY COLUMN frequency varchar(20) NULL,
            MODIFY COLUMN number_of_installments int NULL,
            MODIFY COLUMN gateway varchar(20) NULL
            ;`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
