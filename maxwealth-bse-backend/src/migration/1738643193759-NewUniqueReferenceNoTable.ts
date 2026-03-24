import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewUniqueReferenceNoTable1738643193759
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS unique_reference_no');

    await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS unique_reference_no(
                id INT AUTO_INCREMENT PRIMARY KEY,
                unique_number VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            );
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
