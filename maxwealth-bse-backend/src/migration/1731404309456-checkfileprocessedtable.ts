import { MigrationInterface, QueryRunner } from 'typeorm';

export class Checkfileprocessedtable1731404309456
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE file_processed (
                id SERIAL PRIMARY KEY,
                file_name VARCHAR(255) NOT NULL,
                is_processed BOOLEAN DEFAULT FALSE
            );
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
