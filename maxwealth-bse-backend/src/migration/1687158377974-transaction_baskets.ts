import { MigrationInterface, QueryRunner } from 'typeorm';

export class transactionBaskets1687158377974 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE IF NOT EXISTS transaction_baskets (
            id INT AUTO_INCREMENT,
            user_id INT,
            consent_email VARCHAR(255),
            consent_isd_code VARCHAR(10),
            consent_mobile VARCHAR(20),
            otp INT,
            is_consent_verified tinyint null ,
            status VARCHAR(50),
            payment_id VARCHAR(255),
            payment_status VARCHAR(255),
            payment_failure_reason VARCHAR(255),
            PRIMARY KEY (id),
            FOREIGN KEY (user_id) REFERENCES users(id),
            \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
            \`updated_at\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            
          );`);

    await queryRunner.query(`CREATE TABLE IF NOT EXISTS transaction_basket_items (
            id INT AUTO_INCREMENT,
            transaction_basket_id INT,
            frequency VARCHAR(50),
            installment_day int,
            number_of_installments int,
            transaction_type VARCHAR(50),
            fund_isin VARCHAR(50),
            folio_number VARCHAR(50),
            amount FLOAT,
            units INT,
            euin VARCHAR(50),
            partner VARCHAR(50),
            to_fund_isin VARCHAR(50),
            status VARCHAR(50),
            response_message VARCHAR(255),
            step_up_frequency VARCHAR(255),
            step_up_amount float,
            payment_method VARCHAR(50),
            payment_source  VARCHAR(50),
            user_id Int,
            fp_sip_id VARCHAR(255),
            is_consent_verified tinyint null,
            FOREIGN KEY (user_id) REFERENCES users (id),
            PRIMARY KEY (id),
            FOREIGN KEY (transaction_basket_id) REFERENCES transaction_baskets(id),
            \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
            \`updated_at\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
          )`);

    await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS purchases (
            id  INT AUTO_INCREMENT,
            old_id  int,
            fp_id  VARCHAR(255),
            plan VARCHAR(255),
            state VARCHAR(20),
            folio_number VARCHAR(20),
            systematic BOOLEAN ,
            frequency VARCHAR(20) ,
            scheme VARCHAR(20) ,
            auto_generate_instalments BOOLEAN ,
            installment_day INT ,
            start_date DATE ,
            end_date DATE,
            requested_activation_date DATE,
            number_of_installments INT,
            next_installment_date DATE ,
            previous_installment_date DATE ,
            remaining_installments INT,
            amount DECIMAL(10, 2),
            payment_method VARCHAR(50),
            payment_source VARCHAR(50),
            purpose VARCHAR(50) ,
            source_ref_id VARCHAR(50),
            euin VARCHAR(20),
            partner VARCHAR(50),
            created_at DATETIME ,
            activated_at DATETIME,
            cancelled_at DATETIME,
            completed_at DATETIME,
            failed_at DATETIME,
            cancellation_scheduled_on DATETIME,
            reason VARCHAR(50),
            gateway VARCHAR(50) ,
            user_ip VARCHAR(50),
            server_ip VARCHAR(50),
            initiated_by VARCHAR(20) ,
            initiated_via VARCHAR(20) ,
            user_id INT,
            transaction_basket_item_id INT,
            PRIMARY KEY (id),
            FOREIGN KEY (user_id) REFERENCES users (id),
            FOREIGN KEY (transaction_basket_item_id) REFERENCES transaction_basket_items (id),
         
            \`updated_at\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
          );
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
