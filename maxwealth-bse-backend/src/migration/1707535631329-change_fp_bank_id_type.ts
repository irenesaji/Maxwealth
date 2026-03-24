import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeFpBankIdType1707535631329 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE user_bank_details MODIFY fp_bank_id varchar(255);`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
