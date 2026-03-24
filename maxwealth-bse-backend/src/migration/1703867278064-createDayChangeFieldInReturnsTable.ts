import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDayChangeFieldInReturnsTable1703867278064
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE user_returns_history add column day_change float default 0.0 not null;`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
