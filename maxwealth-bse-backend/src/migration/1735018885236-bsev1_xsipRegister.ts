import { MigrationInterface, QueryRunner } from 'typeorm';

export class Bsev1XsipRegister1735018885236 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE xsip_type (
            id INT AUTO_INCREMENT PRIMARY KEY,
            code VARCHAR(3) UNIQUE NOT NULL,
            description VARCHAR(50) NOT NULL
         )
        `);

    await queryRunner.query(`
            INSERT INTO xsip_type (code, description) VALUES 
            ('01', 'Regular XSIP'),
            ('02', 'Power XSIP'),
            ('03', 'Freedom XSIP'),
            ('07', 'MITRA XSIP'),
            ('08', 'SAMPOORNA XSIP'),
            ('09', 'WHITEOAK XSIP')
        `);

    await queryRunner.query(`
            CREATE TABLE goal_type (
            id INT AUTO_INCREMENT PRIMARY KEY,
            code VARCHAR(3) UNIQUE NOT NULL,
            description VARCHAR(50) NOT NULL
         )
        `);

    await queryRunner.query(`
            INSERT INTO goal_type (code, description) VALUES 
            ('01', 'Kids Marriage'),
            ('02', 'Retirement Planning'),
            ('03', 'Kids’ Education'),
            ('04', 'Tax Savings'),
            ('05', 'Dream House'),
            ('06', 'Dream Car'),
            ('07', 'Dream Vacation'),
            ('08', 'Others')
        `);

    await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS bse_xsip_register (
                id INT AUTO_INCREMENT PRIMARY KEY,
                login_id VARCHAR(255),
                member_id VARCHAR(255),
                password VARCHAR(255),
                scheme_code VARCHAR(255),
                client_code VARCHAR(255),
                internal_ref_no VARCHAR(255),
                trans_mode VARCHAR(255),
                dp_trans_mode VARCHAR(255),
                start_date VARCHAR(255),
                frequency_type VARCHAR(255),
                frequency_allowed tinyint,
                installment_amount DECIMAL(10, 2),
                no_of_installemnts int,
                remarks VARCHAR(255),
                folio_no VARCHAR(255),
                first_order_flag VARCHAR(255),
                sub_br_code VARCHAR(255),
                euin VARCHAR(255),
                euin_declaration_flag VARCHAR(255),
                dpc VARCHAR(255),
                sub_broker_arn VARCHAR(255),
                end_date VARCHAR(255),
                registration_type VARCHAR(255),
                brokerage DECIMAL(10, 2),
                mandate_id VARCHAR(255),
                xsip_type VARCHAR(255),
                target_scheme VARCHAR(255),
                target_amount DECIMAL(10, 2),
                goal_type VARCHAR(255),
                goal_amount DECIMAL(10, 2),
                filler_1 VARCHAR(255),
                filler_2 VARCHAR(255),
                filler_3 VARCHAR(255),
                filler_4 VARCHAR(255),
                filler_5 VARCHAR(255),
                xsip_reg_id bigint,
                bse_remarks VARCHAR(1000),
                success_flag VARCHAR(255),
                internal_reference_number VARCHAR(255),
                response_filler1 VARCHAR(255),
                response_filler2 VARCHAR(255),
                response_filler3 VARCHAR(255),
                response_filler4 VARCHAR(255),
                response_filler5 VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            );
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
