import { MigrationInterface, QueryRunner } from 'typeorm';

export class Updatetransactioncolumnstonull1731390434948
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE transaction_reports
              MODIFY COLUMN user_id INT NULL,
              MODIFY COLUMN object VARCHAR(255) NULL,
              MODIFY COLUMN amount DECIMAL(10, 2) NULL,
              MODIFY COLUMN units DECIMAL(10, 2) NULL,
              MODIFY COLUMN traded_on DATE NULL,
              MODIFY COLUMN traded_at INT NULL,
              MODIFY COLUMN \`order\` VARCHAR(255) NULL,
              MODIFY COLUMN corporate_action VARCHAR(255) NULL,
              MODIFY COLUMN related_transaction_id BIGINT NULL,
              MODIFY COLUMN rta_order_reference VARCHAR(20) NULL,
              MODIFY COLUMN rta_product_code VARCHAR(20) NULL,
              MODIFY COLUMN rta_investment_option VARCHAR(20) NULL,
              MODIFY COLUMN rta_scheme_name VARCHAR(100) NULL,
              MODIFY COLUMN sources JSON NULL
          `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
