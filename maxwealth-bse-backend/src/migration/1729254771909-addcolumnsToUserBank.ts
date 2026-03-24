import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddcolumnsToUserBank1729254771909 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE user_bank_details 
            ADD COLUMN account_type varchar(300),
            ADD COLUMN branch_name varchar(200),
            ADD COLUMN bank_city varchar(200),
            ADD COLUMN bank_state varchar(200)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
