import { MigrationInterface, QueryRunner } from 'typeorm';

export class Bsev1SwpRegister1735301024454 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS bse_swp_register (
                id INT AUTO_INCREMENT PRIMARY KEY,
                client_code VARCHAR(255),
                bse_scheme_code VARCHAR(255),
                transaction_mode VARCHAR(255),
                folio_no VARCHAR(255),
                internal_ref_no VARCHAR(255),
                start_date Date,
                no_of_withdrawls int,
                frequency_type VARCHAR(255),
                installment_amount DECIMAL(25, 3),
                installment_units DECIMAL(25, 3),
                first_order_today VARCHAR(255),
                sub_br_code VARCHAR(255),
                euin_declaration_flag VARCHAR(255),
                euin VARCHAR(255),
                remarks VARCHAR(255),
                sub_broker_arn VARCHAR(255),
                mobile_no int,
                email VARCHAR(255),
                bank_account_no VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            );
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
