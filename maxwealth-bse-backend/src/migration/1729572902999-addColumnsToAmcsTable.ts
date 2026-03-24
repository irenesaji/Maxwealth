import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddColumnsToAmcsTable1729572902999 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE amcs 
            ADD COLUMN deposit_bank_name varchar(200),
            ADD COLUMN deposit_account_no varchar(200),
            ADD COLUMN deposit_ifsc_code varchar(200),
            ADD COLUMN linked_account_id varchar(200)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
