import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateColumnType1738129045680 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE bse_stp_register
            MODIFY COLUMN stp_registration_no varchar(255),
            MODIFY COLUMN response_stp_reg_no varchar(255),
            MODIFY COLUMN from_order_no varchar(255),
            MODIFY COLUMN to_order_no varchar(255);
          `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
