import { MigrationInterface, QueryRunner } from 'typeorm';

export class Bsev1StpRegister1735536941565 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS bse_stp_register (
                id INT AUTO_INCREMENT PRIMARY KEY,
                login_id VARCHAR(255),
                member_id VARCHAR(255),
                password VARCHAR(255),
                transaction_type VARCHAR(255),
                stp_type VARCHAR(255),
                client_code VARCHAR(255),
                from_bse_scheme_code VARCHAR(255),
                to_bse_scheme_code VARCHAR(255),
                buy_sell_type VARCHAR(255),
                transaction_mode VARCHAR(255),
                folio_no VARCHAR(255),
                stp_registration_no bigint,
                internal_ref_no VARCHAR(255),
                start_date VARCHAR(255),
                frequency_type VARCHAR(255),
                no_of_transfers int,
                installment_amount DECIMAL(25, 3),
                units int,
                first_order_today VARCHAR(255),
                sub_br_code VARCHAR(255),
                euin_declaration_flag VARCHAR(255),
                euin VARCHAR(255),
                remarks VARCHAR(255),
                end_date VARCHAR(255),
                sub_broker_arn VARCHAR(255),
                filler_1 VARCHAR(255),
                filler_2 VARCHAR(255),
                filler_3 VARCHAR(255),
                filler_4 VARCHAR(255),
                filler_5 VARCHAR(255),
                response_stp_reg_no bigint,
                bse_remarks VARCHAR(1000),
                success_flag VARCHAR(255),
                from_order_no bigint,
                to_order_no bigint,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            );
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
