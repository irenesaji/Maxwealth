import { MigrationInterface, QueryRunner } from 'typeorm';

export class Goalisdeleted1726810414094 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE user_goals
            ADD COLUMN is_deleted tinyint default 0;`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
