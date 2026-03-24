import { MigrationInterface, QueryRunner } from 'typeorm';

export class redemptions1687494229846 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE if not exists  redemptions (
            id INT AUTO_INCREMENT,
            fp_id VARCHAR(255),
            old_id INT,
            mf_investment_account VARCHAR(255),
            folio_number VARCHAR(255),
            state VARCHAR(255),
            amount DECIMAL(10, 2),
            scheme VARCHAR(255),
            redemption_mode VARCHAR(255),
            traded_on DATE,
            failed_at DATE,
            plan VARCHAR(255),
            euin VARCHAR(255),
            partner VARCHAR(255),
            distributor_id VARCHAR(255),
            units INT,
            redeemed_price DECIMAL(10, 2),
            redeemed_units INT,
            redeemed_amount DECIMAL(10, 2),
            redemption_bank_account_number VARCHAR(255),
            redemption_bank_account_ifsc_code VARCHAR(255),
            scheduled_on DATE,
            created_at DATETIME,
            confirmed_at DATETIME,
            succeeded_at DATETIME,
            submitted_at DATETIME,
            reversed_at DATETIME,
            gateway VARCHAR(255),
            initiated_by VARCHAR(255),
            initiated_via VARCHAR(255),
            source_ref_id VARCHAR(255),
            user_ip VARCHAR(255),
            server_ip VARCHAR(255),
            user_id INT,
            transaction_basket_item_id INT,
            PRIMARY KEY (id),
            FOREIGN KEY (user_id) REFERENCES users (id),
            FOREIGN KEY (transaction_basket_item_id) REFERENCES transaction_basket_items (id),
            \`updated_at\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
         
          );
          `);

    await queryRunner.query(`
          CREATE TABLE if not exists switch_funds (
            id INT AUTO_INCREMENT PRIMARY KEY,
            fp_id VARCHAR(255),
            old_id INT,
            mf_investment_account VARCHAR(255),
            folio_number VARCHAR(255),
            state VARCHAR(255),
            amount DECIMAL(10, 2),
            units INT,
            switch_out_scheme VARCHAR(255),
            switch_in_scheme VARCHAR(255),
            plan VARCHAR(255),
            switched_out_units INT,
            switched_out_amount DECIMAL(10, 2),
            switched_out_price DECIMAL(10, 2),
            switched_in_units INT,
            switched_in_amount DECIMAL(10, 2),
            switched_in_price DECIMAL(10, 2),
            gateway VARCHAR(255),
            traded_on DATE,
            scheduled_on DATE,
            created_at DATETIME,
            succeeded_at DATETIME,
            submitted_at DATETIME,
            reversed_at DATETIME,
            failed_at DATETIME,
            confirmed_at DATETIME,
            source_ref_id VARCHAR(255),
            user_ip VARCHAR(255),
            server_ip VARCHAR(255),
            initiated_by VARCHAR(255),
            initiated_via VARCHAR(255),
            euin VARCHAR(255),
            partner VARCHAR(255),
            failure_code VARCHAR(255),
            user_id INT,
            transaction_basket_item_id INT,
            FOREIGN KEY (user_id) REFERENCES users (id),
            FOREIGN KEY (transaction_basket_item_id) REFERENCES transaction_basket_items (id)
          );          
          `);

    await queryRunner.query(
      `ALTER TABLE \`transaction_basket_items\` ADD column fp_swp_id int null`,
    );

    await queryRunner.query(
      `ALTER TABLE \`transaction_basket_items\` ADD column fp_stp_id int null`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
