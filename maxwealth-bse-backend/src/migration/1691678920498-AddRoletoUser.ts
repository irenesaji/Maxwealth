import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRoletoUser1691678920498 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE users add column role  ENUM('User', 'Admin') default 'User';`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
