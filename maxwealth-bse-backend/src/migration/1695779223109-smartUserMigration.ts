import { MigrationInterface, QueryRunner } from 'typeorm';

export class SmartUserMigration1695779223109 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE if not exists user_smart_returns_history (
            id INT AUTO_INCREMENT,
            user_id INT,
            transaction_basket_id INT,
            invested_amount float,
            current_value float,
            unrealized_gain float,
            absolute_return float,
            cagr float,
            xirr float,
            date DATE,
            addjusted_value float,
            FOREIGN KEY (user_id) REFERENCES users (id),
            FOREIGN KEY (transaction_basket_id) REFERENCES transaction_baskets (id),
            PRIMARY KEY (id),
            \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
            \`updated_at\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
