import { MigrationInterface, QueryRunner } from 'typeorm';

export class Transaction1725602306315 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE transaction (
              id INT AUTO_INCREMENT PRIMARY KEY,
              folio_number VARCHAR(255) NOT NULL,
              isin VARCHAR(255) NOT NULL,
              type VARCHAR(50),
              amount float,
              units float,
              traded_on DATE,
              traded_at float,
              \`order\` VARCHAR(255),
              corporate_action VARCHAR(255),
              related_transaction_id INT,
              rta_order_reference VARCHAR(255),
              rta_product_code VARCHAR(255),
              rta_investment_option VARCHAR(255),
              rta_scheme_name VARCHAR(255),
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
              user_id INT,
              FOREIGN KEY (\`user_id\`) REFERENCES users(id) ON DELETE CASCADE,
              rta VARCHAR(255)
            );
          `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
