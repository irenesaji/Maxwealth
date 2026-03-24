import { MigrationInterface, QueryRunner } from 'typeorm';

export class Transactionsources1725613578609 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE transaction_sources (
              id INT AUTO_INCREMENT PRIMARY KEY,
              transaction_id INT NOT NULL,
              days_held INT,
              units float,
              purchased_on DATE,
              purchased_at TIME,
              gain float,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
              user_id INT,
               FOREIGN KEY (\`user_id\`) REFERENCES users(id) ON DELETE CASCADE,
               FOREIGN KEY (\`transaction_id\`) REFERENCES transaction(id) ON DELETE CASCADE
            );
          `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
