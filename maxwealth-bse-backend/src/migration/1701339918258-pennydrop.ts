import { MigrationInterface, QueryRunner } from 'typeorm';

export class Pennydrop1701339918258 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE pennydrops (
            id INT AUTO_INCREMENT PRIMARY KEY,
            account_number VARCHAR(100) NOT NULL,
            ifsc VARCHAR(100) NOT NULL,
            name_match_valid BOOLEAN default false,
            name VARCHAR(255) NOT NULL,
            is_bank_valid   BOOLEAN default false
        );
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
