import { MigrationInterface, QueryRunner } from 'typeorm';

export class TransactionReports1729955349674 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE transaction_reports(
              id INT PRIMARY KEY AUTO_INCREMENT,
              user_id INT,
              object VARCHAR(255),
              folio_number VARCHAR(20) NOT NULL,
              isin VARCHAR(12) NOT NULL,
              type VARCHAR(20) NOT NULL,
              amount DECIMAL(10, 2) NOT NULL,
              units DECIMAL(10, 2) NOT NULL,
              traded_on DATE NOT NULL,
              traded_at INT NOT NULL,
             \`order\` VARCHAR(255) NULL,
              corporate_action VARCHAR(255) NULL,
              related_transaction_id BIGINT NULL,
              rta_order_reference VARCHAR(20) NOT NULL,
              rta_product_code VARCHAR(20) NOT NULL,
              rta_investment_option VARCHAR(20) NOT NULL,
              rta_scheme_name VARCHAR(100) NOT NULL,
              sources json NOT NULL,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
              FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            );
          `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
