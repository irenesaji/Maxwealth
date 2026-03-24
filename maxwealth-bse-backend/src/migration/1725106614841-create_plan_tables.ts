import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePlanTables1725106614841 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE mf_purchase_plans (
                id VARCHAR(50) PRIMARY KEY,
                state VARCHAR(20) NOT NULL,
                mf_investment_account VARCHAR(50),
                folio_number VARCHAR(20),
                systematic BOOLEAN NOT NULL,
                frequency ENUM('daily', 'weekly', 'monthly', 'quarterly') NOT NULL,
                scheme VARCHAR(20) NOT NULL,
                auto_generate_instalments BOOLEAN NOT NULL,
                installment_day INT NOT NULL,
                start_date DATE NOT NULL,
                end_date DATE,
                requested_activation_date DATETIME,
                number_of_installments INT NOT NULL,
                next_installment_date DATE,
                previous_installment_date DATE,
                remaining_installments INT,
                amount DECIMAL(15, 2) NOT NULL,
                payment_method VARCHAR(50),
                payment_source VARCHAR(50),
                purpose VARCHAR(100),
                source_ref_id VARCHAR(50),
                euin VARCHAR(20),
                partner VARCHAR(50) ,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP  ,
                activated_at DATETIME,
                cancelled_at DATETIME,
                completed_at DATETIME,
                failed_at DATETIME,
                cancellation_scheduled_on DATETIME,
                cancellation_code VARCHAR(20),
                reason VARCHAR(255),
                gateway VARCHAR(20),
                user_ip VARCHAR(45),
                server_ip VARCHAR(45),
                initiated_by VARCHAR(100),
                initiated_via VARCHAR(100),
                user_id int,
                transaction_basket_item_id int,
                FOREIGN KEY (user_id) REFERENCES users (id),
                FOREIGN KEY (transaction_basket_item_id) REFERENCES transaction_basket_items (id),
                \`updated_at\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                );
            `);
    await queryRunner.query(`CREATE TABLE mf_redemption_plans (
            id VARCHAR(50) PRIMARY KEY,
            state VARCHAR(20) NOT NULL,
            systematic BOOLEAN DEFAULT TRUE,
            mf_investment_account VARCHAR(50),
            folio_number VARCHAR(20) NOT NULL,
            frequency VARCHAR(20) NOT NULL,
            scheme VARCHAR(20) NOT NULL,
            installment_day INT NOT NULL,
            start_date DATE NOT NULL,
            end_date DATE NOT NULL,
            number_of_installments INT NOT NULL,
            auto_generate_installments BOOLEAN DEFAULT TRUE,
            next_installment_date DATE,
            previous_installment_date DATE,
            remaining_installments INT,
            amount DECIMAL(15, 2) NOT NULL,
            source_ref_id VARCHAR(50),
            euin VARCHAR(50),
            partner VARCHAR(50),
           created_at DATETIME DEFAULT CURRENT_TIMESTAMP  ,
            activated_at DATETIME,
            requested_activation_date DATETIME,
            cancelled_at DATETIME,
            completed_at DATETIME,
            failed_at DATETIME,
            cancellation_scheduled_on DATETIME,
            gateway VARCHAR(20) NOT NULL,
            user_ip VARCHAR(45),
            server_ip VARCHAR(45),
            initiated_by VARCHAR(20),
            initiated_via VARCHAR(20),
            reason TEXT,
            user_id int,
            transaction_basket_item_id int,
            FOREIGN KEY (user_id) REFERENCES users (id),
            FOREIGN KEY (transaction_basket_item_id) REFERENCES transaction_basket_items (id),
            \`updated_at\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );
        `);
    await queryRunner.query(`CREATE TABLE mf_switch_plans (
            id VARCHAR(50) PRIMARY KEY,
            state VARCHAR(20) NOT NULL,
            systematic BOOLEAN DEFAULT TRUE,
            mf_investment_account VARCHAR(50),
            folio_number VARCHAR(20) NOT NULL,
            frequency VARCHAR(20) NOT NULL,
            switch_in_scheme VARCHAR(20) NOT NULL,
            switch_out_scheme VARCHAR(20) NOT NULL,
            installment_day INT NOT NULL,
            start_date DATE NOT NULL,
            end_date DATE NOT NULL,
            number_of_installments INT NOT NULL,
            auto_generate_installments BOOLEAN DEFAULT TRUE,
            next_installment_date DATE,
            previous_installment_date DATE,
            remaining_installments INT,
            amount DECIMAL(15, 2) NOT NULL,
            source_ref_id VARCHAR(50),
            euin VARCHAR(50),
            partner VARCHAR(50),
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP  ,
            activated_at DATETIME,
            requested_activation_date DATETIME,
            cancelled_at DATETIME,
            completed_at DATETIME,
            failed_at DATETIME,
            cancellation_scheduled_on DATETIME,
            gateway VARCHAR(20) NOT NULL,
            user_ip VARCHAR(45),
            server_ip VARCHAR(45),
            initiated_by VARCHAR(20),
            initiated_via VARCHAR(20),
            reason TEXT,
            user_id INT,
            transaction_basket_item_id INT,
            FOREIGN KEY (user_id) REFERENCES users (id),
            FOREIGN KEY (transaction_basket_item_id) REFERENCES transaction_basket_items (id),
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );
        `);

    await queryRunner.query(
      `alter table transaction_basket_items add column generate_first_installment_now tinyint(1);`,
    );

    await queryRunner.query(
      `alter table mandates add column customer_id varchar(100);`,
    );

    await queryRunner.query(`CREATE TABLE rzp_customers (
                    id VARCHAR(50) PRIMARY KEY,
                    name VARCHAR(100) NOT NULL,
                    email VARCHAR(100),
                    contact VARCHAR(15),
                    gstin VARCHAR(15),
                    notes JSON,
                    created_at BIGINT
                    );`);

    await queryRunner.query(
      `alter table mandates change column mandate_id mandate_id varchar(100);`,
    );
    await queryRunner.query(
      `alter table mandates change column fp_bank_id fp_bank_id int NULL;`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
