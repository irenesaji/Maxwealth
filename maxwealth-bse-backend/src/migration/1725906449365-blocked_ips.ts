import { MigrationInterface, QueryRunner } from 'typeorm';

export class BlockedIps1725906449365 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE blocked_ips (
            id INT AUTO_INCREMENT PRIMARY KEY,
            ip VARCHAR(255) UNIQUE NOT NULL,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
            );
            `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
